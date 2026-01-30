rm -rf ~/tools/command-circuit

mkdir -p ~/tools/command-circuit

cp src-tauri/target/release/bundle/deb/*.deb ~/tools/command-circuit

cd ~/tools/command-circuit

mv *.deb cc.deb

ar x cc.deb

tar xf data.tar.gz

rm cc.deb

rm data.tar.gz

cp usr/share/applications/Command\ Circuit.desktop ~/.local/share/applications/

cd -
