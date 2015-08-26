#----------------------------------------------
echo "[x] Download <% dpkg.name %> Packet"
wget <% dpkg.link %>

echo "[x] Install All Local Deps Depedencies"
sudo dpkg -i *
sudo apt-get install -f -y
rm *.deb 
echo "[y] Done Install All Local Deps Depedencies"
#----------------------------------------------