# IC_NFT
黑客松demo

>重置

    dfx stop || rm -rf .dfx  || dfx identity remove jack ||dfx identity remove alice
>启动

    dfx start --background

>部署

    dfx identity new jack || dfx identity use jack
    dfx deploy --argument '(principal "'$(dfx identity get-principal)'")' 

>mint

    dfx canister call erc721 mint '("file test","jayz","http:baidu.com","description test")'

>balanceOf

    dfx canister call erc721 balanceOf

>ownof

    dfx canister call erc721  ownerOf '("1")'

>transfer

    dfx identity new alice || dfx identity use alice && dfx identity get-principal && dfx identity use jack
    dfx canister call erc721  transferFrom '(principal "'$(dfx identity get-principal)'",principal "Alice's Principal","1")'
    dfx canister call erc721  ownerOf '("1")'

>划转成功

    dfx stop