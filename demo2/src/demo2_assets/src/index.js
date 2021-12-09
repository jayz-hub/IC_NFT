import { idlFactory} from "../../declarations/demo2/demo2.did.js";
import { Principal } from '@dfinity/principal';

const canisterId = 'qqamp-7iaaa-aaaah-qakha-cai'

const encodeArrayBuffer = (file) => Array.from(new Uint8Array(file));
document.getElementById('mint').addEventListener('change', async(evt) => {
  const file_list = evt.target.files
  const file = file_list[0];
  console.log(file)
  let fileArrayBuffer = await file.arrayBuffer();
  var mintRequest = {
    url: "/Token/" + file.name.split('.')[0],
    contentType: file.type,
    data: encodeArrayBuffer(fileArrayBuffer),
    desc: "Example description of ICPunk",
    name: "ICPunk#" + file.name,
    properties: [
      { name: 'Background', value: 'black' }
    ],
  };
  console.log("mint start with url:" + mintRequest.url + ",contentType:"+mintRequest.contentType+",desc:"+mintRequest.desc+",name:"+mintRequest.name)
  const index = await icpunks.mint(mintRequest);
  console.log("mint nft success,tokenId = "+index);
});


document.getElementById('transfer').addEventListener('click', async () => {
  const targetPrincipal = Principal.fromText(document.getElementById("transferTo").value);
  const tokenId = parseInt(document.getElementById("tokenId").value);
  var result = await icpunks.transfer_to(targetPrincipal, tokenId);
  console.log("transfer result :"+result);
});

document.getElementById('login').addEventListener('click', async () => {
  await init()
});


let icpunks;
async function init() {
  const whitelist = [canisterId];
  const plug = window.ic.plug
  const requestConnect = await plug.requestConnect({whitelist: whitelist, timeout: 5000})
  const isConnected = await plug.isConnected();
  const createAgent = await plug.createAgent({whitelist: whitelist});
  console.log(isConnected,whitelist,idlFactory)
  icpunks = await plug.createActor({
    canisterId : canisterId,
    interfaceFactory : idlFactory,
  });
  console.log("plug init ok");
};

document.getElementById('data_of').addEventListener('click', async(evt) => {
  const tokenId = document.getElementById('data_of_input').value;
  var mintRequest = await icpunks.data_of(parseInt(tokenId));
  console.log("data_of tokenId "+tokenId+" is name: "+mintRequest.name + ",desc:"+mintRequest.desc)
});


document.getElementById('owner').addEventListener('click', async(evt) => {
  const tokenId = document.getElementById('owner_of').value;
  const owner = await icpunks.owner_of(parseInt(tokenId));
  console.log("owner_of tokenId "+tokenId +" is : " + owner.toString())
});
