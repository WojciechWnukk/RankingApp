import React, { useEffect, useState } from 'react';
import MovieImageArr from './MovieImages';
import RankingGrid from './RankingGrid';
import ItemCollection from './ItemCollection';

const RankItems = ( {items, setItems, dataType, imgArr, localStorageKey } ) => {

    const [reload, setReload] = useState(false);

    function Reload() {
        setReload(true);
    }

    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }

    function allowDrop(ev) {
        ev.preventDefault();
    }
    function drop(ev) {
        ev.preventDefault();
        const targetEml = ev.target;
        if (targetEml.nodeName === "IMG") {
            return false;
        }
        if (targetEml.childNodes.length === 0) {
            var data = parseInt(ev.dataTransfer.getData("text").substring(5));
            const transformedCollection = items.map((item) => (item.id === parseInt(data)) ?
             { ...item, ranking: parseInt(targetEml.id.substring(5)) } : { ...item, ranking: item.ranking });
             setItems(transformedCollection);
        }
    }

    useEffect(() => {
        if(items == null) {
            getDataFromApi();
        }
    }
    , [dataType]);

    function getDataFromApi() {
        fetch(`item/${dataType}`)
            .then(response => response.json())
            .then(data => setItems(data));
        console.log(items);
    }

    useEffect(() => {
        if (items != null){
            localStorage.setItem(localStorageKey, JSON.stringify(items));
        }
    }, [items]);

    useEffect(() => {
        if(reload){
            getDataFromApi();
        }
    }, [dataType]);

    return (
        (items != null) ?
        <main>
        <RankingGrid items={items} imgArr={imgArr} drag={drag} allowDrop={allowDrop} drop={drop} />
        <ItemCollection items={items} drag={drag} imgArr={imgArr} />
        <button onClick={ Reload } className="reload" style={{"marginTop": "10px"}}>Reload</button>
        </main>
        : <main>Loading...</main>
    );
};
export default RankItems;