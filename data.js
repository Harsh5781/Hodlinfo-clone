const {data} = await axios.get('https://api.wazirx.com/api/v2/tickers')
await Crypto.deleteMany()
    let c =0
    for(let key in data)
    {
        if (data.hasOwnProperty(key))
        {
            const value = data[key]
            // console.log(value)
            const db = new Crypto(value)
            await db.save()
            c=c+1
        }
        if(c==10)
        {
            break
        }
    }