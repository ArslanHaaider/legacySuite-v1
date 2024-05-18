import FreighterComponent from "./ConnectFreighter"
import ClaimAsset from "./ClaimAsset"
import { useEffect } from "react"
import { xdr,Address } from "@stellar/stellar-sdk"
import { Server } from "@stellar/stellar-sdk/lib/rpc/server"
import { getPublicKey } from "@stellar/freighter-api"
const Benificiary = ()=>{
    useEffect(()=>{
        let data
        let publicKey ;
        const fetchAssets = async()=>{
            const server = new Server("https://horizon-testnet.stellar.org/",{
             allowHttp:true
          })
          publicKey = await getPublicKey();
          const address = new Address(publicKey).toScAddress();
          const key = xdr.ScVal.scvAddress(address)
           data = await server.getContractData("CDU6NSPK57UDMWGOCBQLPSHGCKC3RDEE527JNVOOUYNCYPYLWL7VGWCB",key)
           console.log(data.val)
        }
        fetchAssets()
    },[])
    return(

        <>
            <div className="w-full h-[20vh] border border-red-500 flex flex-col items-center justify-center">
            <button className="btn btn-primary">
            <FreighterComponent/>
          </button>
            </div>
            <div>
                <ClaimAsset/>   
            </div>
        </>
    )
}

export default Benificiary