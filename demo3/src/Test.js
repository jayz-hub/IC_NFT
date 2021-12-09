import { useEffect, useState} from "react";
import {getNFTActor} from "@psychedelic/dab-js";

function Test() {

    const [wl, setWl] = useState('qqamp-7iaaa-aaaah-qakha-cai')
    const [stanard, setStandard] = useState("ICPunks")
    // const [wl, setWl] = useState('qqamp-7iaaa-aaaah-qakha-cai')
    // const [stanard, setStandard] = useState("ICPunks")
    const [initializedAgent, setInitializedAgent] = useState(false)
    const [agent, setAgent] = useState(null)
    useEffect(() => {
        (async () => {
            if (agent === null && !initializedAgent) {
                setInitializedAgent(true)
                const plug = window.ic.plug
                const requestConnect = await plug.requestConnect({whitelist: [wl], timeout: 5000})
                const isConnected = await plug.isConnected();
                const createAgent = await plug.createAgent({whitelist: [wl]});
                setAgent(plug.agent)
            }
        })()
    }, [agent, initializedAgent, wl, setInitializedAgent, setAgent])

    const [nft, setNft] = useState([])
    const [desc, setDesc] = useState([])
    const [fetched, setFetched] = useState(false)
    useEffect(() => {
        (async () => {
            if (agent !== null && !fetched) {
                setFetched(true)
                const nftActor = getNFTActor(wl, agent, stanard)
                const result = await nftActor.details(2)
                setNft(result)
                setDesc(result.metadata.desc)
                console.log(result);
                console.log(result.metadata.toString())
            }
        })()
    }, [fetched, agent])

    return (
        <div>
            <div>
                <div>
                    <img src={nft.url} style={{width:200}}/>
                </div>
                <div>NFT Name:{nft.name}</div>
                <div>NFT Desc:{desc}</div>
            </div>
        </div>
    );
}

export default Test;
