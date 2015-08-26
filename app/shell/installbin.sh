#<% bin.name %>
wget <% bin.link %>
tar -xfvz <% bin.file %>
mv <% bin.source %> <% bin.target %>
echo 'export PATH="<% bin.bin %>:$PATH"' >> ~/.zshrc  
echo "<% bin.name %> installed"
#---------------------------------