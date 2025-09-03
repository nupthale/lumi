1. 启动前， 先启动docker， 通过nginx代理到pouchdb-server， 跳过浏览器http1 连接数限制。
1. 直接在根目录docker-compose -f docker-compose.dev.yml up -d启动。
1. 访问Fauxton UI， http://localhost:3001/_utils/#/_all_dbs
1. 通过nginx访问pouchdb-server， 配置https://localhost:443

pouchdb-server官方不支持http2， 前置必须要有一个支持http2的反向代理，因为浏览器pouchdb如果用http1， 有最大链接数限制， 就5-6个， 超过就不同步了。
https://github.com/pouchdb/pouchdb/issues/8218
如果用http2就没有限制。

in-memory测试：
pouchdb-server --in-memory

本地nginx启动方法：
1. brew services start nginx,  重启brew services reload nginx
2. 访问Fauxton UI https://127.0.0.1/_utils/#/_all_dbs
3. 配置web端的src/database/database, pouchdb remote 为https://127.0.0.1:443

本地nginx所在目录： /usr/local/etc/nginx/

因为证书是本地的， 如果是safari浏览器， 还需要访问   https://127.0.0.1/docs_hale/， 然后点击“显示证书”， 所有选择“始终信任”， 然后再点继续访问报错就消失了， 否则还是会cors。chrome没这个问题。

本地问题排查：
1. cors错误， 访问fauxton，查看cors是否开启
2. nginx配置， 看cors允许的ip， 是ip还是localhost， 现在是localhost:5173可以；
3. chrome/safari， 有时候都哟啊访问一下https://127.0.0.1/docs_hale/， 然后信任证书才行， 否则也是cors

火狐浏览器， 要输入about:config， 然后搜索cors， 关闭cors设置为false， 刷新才行。

nginx要配置入下：允许跨域：
```
 server {
        listen       443 ssl;
        server_name  localhost;

        ssl_certificate      ./cert/server.crt;
        ssl_certificate_key  ./cert/server.key;

        location / {
            proxy_pass http://127.0.0.1:3001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        
		
		    # CORS 头
        	add_header 'Access-Control-Allow-Origin' 'http://127.0.0.1:5173' always;
		    add_header 'Access-Control-Allow-Credentials' 'true' always;
        	add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
       	 	add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        	add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;

        	# 处理预检请求
        	if ($request_method = 'OPTIONS') {
                add_header 'Access-Control-Allow-Origin' 'http://127.0.0.1:5173' always;
                add_header 'Access-Control-Allow-Credentials' 'true' always;
                add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS, PUT, DELETE' always;
                add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
                add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;
                add_header 'Access-Control-Max-Age' 1728000;
                add_header 'Content-Type' 'text/plain charset=UTF-8';
                add_header 'Content-Length' 0;
                return 204;
        	}
	}
}
```
