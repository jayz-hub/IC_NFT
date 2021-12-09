import {useCallback, useEffect, useState} from "react";
import {getAllNFTS, getBatchedNFTs, getNFTActor} from "@psychedelic/dab-js";

function App() {
    const [logs, setLogs] = useState([])
    const [lastTime, setLastTime] = useState(null)

    const addLog = useCallback((log) => {
        log = `${(new Date()).toISOString()} ${log}`
        console.log(log)
        setLogs((logs) => ([log, ...logs]))
    }, [setLogs, lastTime, setLastTime])

    const [wl, setWl] = useState([
        'oeee4-qaaaa-aaaak-qaaeq-cai',
        'ryjl3-tyaaa-aaaaa-aaaba-cai',
        'aipdg-waaaa-aaaah-aaq5q-cai',
        'ep54t-xiaaa-aaaah-qcdza-cai',
        'qxtlu-aiaaa-aaaah-aaupq-cai',
        'e3izy-jiaaa-aaaah-qacbq-cai',
    ])
    const [initializedAgent, setInitializedAgent] = useState(false)
    const [agent, setAgent] = useState(null)
    useEffect(() => {
        (async () => {
            if (agent === null && !initializedAgent) {
                setInitializedAgent(true)
                // const agent = new HttpAgent({
                //     host: 'https://boundary.ic0.app/'
                // })
                // setAgent(agent)
                const plug = window.ic.plug
                addLog(`plug.requestConnect...`)
                const requestConnect = await plug.requestConnect({whitelist: wl, timeout: 5000})
                addLog(`plug.requestConnected ${Object.keys(requestConnect).join(',')}`)
                addLog(`plug.isConnected...`)
                const isConnected = await plug.isConnected();
                addLog(`plug.isConnected ${isConnected}`)
                addLog(`plug.createAgent...`)
                const createAgent = await plug.createAgent({whitelist: wl});
                addLog(`plug.createAgent ${createAgent}`)
                addLog(`plug.agent ${Object.keys(plug.agent).join(',')}`)
                setAgent(plug.agent)
            }
        })()
    }, [agent, initializedAgent, wl, addLog, setInitializedAgent, setAgent])

    const [nfts, setNfts] = useState([])
    const [fetched, setFetched] = useState(false)
    useEffect(() => {
        (async () => {
            if (agent !== null && !fetched) {
                setFetched(true)
                addLog(`getAllNFTS...`)
                const nfts = await getAllNFTS(agent)
                setNfts(nfts)
                addLog(`getAllNFTS ${nfts.length}`)
                console.log(nfts)
                const first = nfts[0]
                const firstCid = first.principal_id.toString()
                addLog(`generate first nft ${first.name} ${firstCid}`)
                await new Promise((resolve => {
                    getBatchedNFTs({
                        principal: first.principal_id,
                        callback: (collection) => {
                            console.log(collection)
                        },
                        onFinish: () => resolve(),
                    })
                }))
                // addLog(`fetching first nft info...`)
                // const info = await getCanisterInfo(firstCid, agent)
                // addLog(`fetched first nft info`)
                // console.log(info)
                const nftActor = getNFTActor(firstCid, agent, first.standard)
                addLog(`fetching ${first.name} first nft...`)
                const result = await nftActor.details(1)
                addLog(`fetched ${first.name} first nft canister ${result.canister} id ${result.id} std ${result.standard} url ${result.url}`)
                console.log(result);
                // await nftActor.transfer('asdf', 1)
            }
        })()
    }, [fetched, addLog, agent])

    return (
        <div>
            <h1>日志（object在控制台看）</h1>
            <div>
                {logs.map(log => (
                    <p key={log}>{log}</p>
                ))}
            </div>
        </div>
    );
}

export default App;
