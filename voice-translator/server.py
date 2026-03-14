#!/usr/bin/env python3
"""
Simple HTTPS server for Voice Translator app testing
生成自签名证书需要在浏览器中信任
"""

import http.server
import socketserver
import ssl
import os
import webbrowser
import sys

PORT = 8080

# Get directory of this script
web_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(web_dir)

Handler = http.server.SimpleHTTPRequestHandler

# Check if SSL certificate exists, if not create one
cert_file = os.path.join(web_dir, 'server.pem')
key_file = cert_file

if not os.path.exists(cert_file):
    print("⚠️ 需要SSL证书...")
    print("创建自签名证书...")
    
    # Try to create certificate using openssl
    try:
        os.system(f'openssl req -x509 -newkey rsa:2048 -keyout {key_file} -out {cert_file} -days 365 -nodes -subj "/CN=localhost"')
        print("✅ 证书创建成功")
    except:
        print("❌ 无法创建证书")
        print("请使用HTTP模式运行...")
        cert_file = None
        key_file = None
else:
    print(f"✅ 找到现有证书: {cert_file}")

if cert_file and os.path.exists(cert_file):
    # HTTPS Server
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(certfile=cert_file, keyfile=key_file)
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
        print(f"\n🌐 HTTPS服务器已启动!")
        print(f"   https://localhost:{PORT}")
        print(f"   http://localhost:{PORT}")
        print(f"\n⚠️  首次访问时需要在浏览器中信任证书")
        print(f"\n按 Ctrl+C 停止服务器\n")
        
        try:
            # Open browser
            webbrowser.open(f'https://localhost:{PORT}')
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n服务器已停止")
else:
    # HTTP Server (语音识别可能无法工作)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"\n⚠️  HTTP服务器已启动 (无SSL)")
        print(f"   http://localhost:{PORT}")
        print(f"\n⚠️  注意: 语音识别需要HTTPS!")
        print(f"   建议使用 ngrok 或 similar 工具创建HTTPS隧道\n")
        
        try:
            webbrowser.open(f'http://localhost:{PORT}')
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n服务器已停止")
