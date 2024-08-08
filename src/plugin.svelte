<div>
    <label for="displayControl">Show Windmills</label>
    { #if !loading }
    <input id="displayControl" type="checkbox" bind:checked={displayed} on:change={() => {onMapMove()}}/>
    <small>Created by DuckSoft</small>
    { /if}
    { #if loading }
    <div class="lds-dual-ring"></div>Loading...
    { /if }
</div>
<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { map } from "@windy/map"

    let elements: L.CircleMarker[] = [];
    let displayed = false;
    let loading = false;

    type OverpassNodeElements = {
        type: 'node';
        id: number;
        lat: number;
        lon: number;
    };

    function renderNodes(nodes: OverpassNodeElements[]) {
        // remove the previous elements from the map
        elements.forEach(element => element.remove());
        // clear the elements array
        elements = [];
        // render the new elements if enabled
        if (!displayed) return;
        nodes.forEach((element: OverpassNodeElements) => {
            const marker = L.circleMarker([element.lat, element.lon], {
                radius: 1,
                color: 'red',
                fillOpacity: 0.5,
            }).addTo(map);
            elements.push(marker);
        });
    }

    function onMapMove() {
        // clear if the plugin is not displayed
        if (!displayed) {
            renderNodes([]);
            return;
        };
        // get the current map bbox
        const bbox = map.getBounds();
        // convert bbox to overpass bbox string
        const bboxStr = `${bbox.getSouth()},${bbox.getWest()},${bbox.getNorth()},${bbox.getEast()}`;
        console.log('Map moved to:', bboxStr);
        // construct windmill overpass query
        const query=`[out:json];node["generator:source"="wind"](${bboxStr});out;`
        // fetch data from overpass
        loading = true;
        fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => { renderNodes(data.elements); loading = false;})
            .catch(error => { console.error('Error fetching data:', error); loading = false; });
    }

    export const onopen = (_params: unknown) => {
        // Your plugin was opened with parameters parsed from URL
        // or with LatLon object if opened from contextmenu
    };

    onMount(() => {
        map.on('moveend', onMapMove);
    });

    onDestroy(() => {
        map.off('moveend', onMapMove);
        displayed = false;
        renderNodes([]);
    });
</script>

<style lang="less">
.lds-dual-ring {
  color: #eeeeee
}
.lds-dual-ring,
.lds-dual-ring:after {
  box-sizing: border-box;
}
.lds-dual-ring {
  display: inline-block;
  width: 1em;
  height: 1em;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: .8em;
  height: .8em;
  margin: .1em;
  border-radius: 50%;
  border: 6.4px solid currentColor;
  border-color: currentColor transparent currentColor transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
small {
    font-size: 0.8em;
    color: #ccc;
}
</style>

