export default function Association(props) {
    // eslint-disable-next-line no-lone-blocks
    {props.associationArray.map((word) => {
    return<div>
            <p>{word.meaning}</p>
            <p>{word.partOfSpeech}</p>
            <p>{word.weight}</p>
        </div>
    
    })}
}
