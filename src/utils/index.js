import axios from "axios"

export const getCurrentCity=()=>{
    const localCity=JSON.parse(localStorage.getItem('hjqzf_city'))
    if(!localCity){
        return new Promise((resolve,reject)=>{
        //如果没有
        const curCity=new window.BMapGL.LocalCity()
        curCity.get(async(res)=>{
            try {
                const result=await axios.get(
                    `http://localhost:4000/area/info?name=${res.name}`
                )
                //保存在本地存储
                localStorage.setItem('hjqzf_city',JSON.stringify(result.data.body))
                resolve(result.data.body)
            } catch (error) {
                //获取定位城市失败
                reject(error)
            }
        })
        })
    }
    return Promise.resolve(localCity)
}