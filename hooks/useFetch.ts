import { useEffect, useState } from 'react'

const useFetch = (url: string) => {

    const [data, setData] = useState([]);

    const fetchData = async () => {
        if (!url) return { data: [] }
        try {
            const res = await fetch(url);
            if (!res) return { error: "no data found" }
            const apiData: any = res.json();
            setData(apiData);
        }
        catch (e) {
            //log error
            return { error: e }
        }
    }

    useEffect(() => {
        fetchData();
    }, [url])
    return { data }

}

export default useFetch;
