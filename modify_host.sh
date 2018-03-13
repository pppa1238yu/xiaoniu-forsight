#!/bash/sh

remote=`grep 'readonly remoteHost' src/app/Constants.ts`
target='    static readonly remoteHost = "stocktips.calfdata.com";'
sed -i "s|$remote|$target|g" src/app/Constants.ts
