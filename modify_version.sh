#!/bash/sh

version=`grep version package.json|awk -F\" '{print $4}'`

extra_css="extra-$version.css"
extra_js="extra-$version.js"
index_css="foresight-$version.css"
index_js="main-$version.js"
wechat_css="weChat-$version.css"
wechat_js="weChat-$version.js"
smart_css="smartReport-$version.css"
smart_js="smartReport-$version.js"

mv build/extra.css "build/$extra_css"
mv build/extra.js "build/$extra_js"
mv build/weChat.css "build/$wechat_css"
mv build/weChat.js "build/$wechat_js"
mv build/smartReport.css "build/$smart_css"
mv build/smartReport.js "build/$smart_js"
cp build/main.js "build/$index_js"
cp build/foresight.css "build/$index_css"

sed -i "s/weChat.css/$wechat_css/g" build/weChat.html
sed -i "s/weChat.js/$wechat_js/g" build/weChat.html

sed -i "s/smartReport.css/$smart_css/g" build/smartReport.html
sed -i "s/smartReport.js/$smart_js/g" build/smartReport.html

sed -i "s/extra.css/$extra_css/g" build/extra.html
sed -i "s/extra.js/$extra_js/g" build/extra.html

remote=`grep 'readonly remoteHost' src/app/Constants.ts`
target='    static readonly remoteHost = "192.168.1.59:38885";'
sed -i "s|$remote|$target|g" src/app/Constants.ts
