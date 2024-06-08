
import {useState} from 'react'

const Scanner = () => {
	const [data, setData] = useState("Not found")
	return(
			  <>
      {/* <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.text);
          }

          if (!!error) {
            setData(error);
          }
        }}
        style={{ width: '100%' }}
      /> */}
      <p>{data}</p>
    </>
		)
}
export default Scanner