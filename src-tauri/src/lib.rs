use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct WaygateItem {
    id: i64,
    item: String,
    title: String,
    favicon: Option<String>,
}

/// Validate and normalize a user-supplied base URL, rejecting anything that is
/// not an http(s) URL so we never issue requests to unexpected schemes/hosts.
fn validate_base_url(url: &str) -> Result<String, String> {
    let parsed = reqwest::Url::parse(url).map_err(|e| format!("Invalid URL: {}", e))?;

    if !matches!(parsed.scheme(), "http" | "https") {
        return Err(format!("Unsupported URL scheme: {}", parsed.scheme()));
    }

    if parsed.host_str().is_none() {
        return Err("URL is missing a host".to_string());
    }

    Ok(url.trim_end_matches('/').to_string())
}

#[tauri::command]
async fn fetch_waygate_items(url: String) -> Result<Vec<WaygateItem>, String> {
    let url = validate_base_url(&url)?;
    let client = reqwest::Client::new();
    let response = client
        .get(format!("{}/items", url))
        .header("Content-Type", "application/json")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        return Err(format!(
            "HTTP {}: {}",
            response.status().as_u16(),
            response
                .status()
                .canonical_reason()
                .unwrap_or("Unknown error")
        ));
    }

    response
        .json::<Vec<WaygateItem>>()
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn delete_waygate_item(url: String, id: i64) -> Result<(), String> {
    let url = validate_base_url(&url)?;
    let client = reqwest::Client::new();
    let response = client
        .delete(format!("{}/items/{}", url, id))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        return Err(format!(
            "HTTP {}: {}",
            response.status().as_u16(),
            response
                .status()
                .canonical_reason()
                .unwrap_or("Unknown error")
        ));
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            fetch_waygate_items,
            delete_waygate_item
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
