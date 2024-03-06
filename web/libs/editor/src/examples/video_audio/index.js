import config from './config.xml';
import tasks from './tasks.json';
import annotation from './annotations/1.json';
import { Button } from 'antd';

const labelsData = [
    { id: 1, value: 'Label 1' },
    // { id: 2, value: 'Label 2' },
    // { id: 3, value: 'Label 3' },
    // { id: 4, value: 'Label 4' },
    // { id: 5, value: 'Label 5' },
    // { id: 6, value: 'Label 6' },
    // { id: 7, value: 'Label 7' },
    // { id: 9, value: 'Label 9' },
    // { id: 10, value: 'Label 10' },
    // { id: 11, value: 'Label 11' },
    // { id: 12, value: 'Label 12' },
    // { id: 13, value: 'Label 13' },
];

const handleAddLabel = () => {
    console.log("HandleLabel Clicked!")
    const randomLabel = {
        id: labelsData.length+1,
        value: `Label at ${new Date().getHours()}:${new Date().getMinutes()}`
    };
    labelsData.push(randomLabel);
}

const DynamicLabeling = <Button onClick={handleAddLabel}>Add random Label</Button>

const labelsConfig = `<View>
        <Header value="Video timeline segmentation via Audio sync trick"/>
        <Video name="video" value="$video" sync="audio"></Video>
        <Labels name="tricks" toName="audio" choice="multiple" dynamicLabeling="${DynamicLabeling}" onClick="${()=> {handleAddLabel()}}" dataArray="${labelsData}" >
            ${ labelsData.map(label => ( `<Label key="${label.id}" value="${label.value}"/>` )).join('')}
        </Labels>
        <Audio name="audio" value="$video" sync="video" zoom="true" speed="true" volume="true"/>
    </View>`;

const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(labelsConfig, 'application/xml');
// Serialize the XML document back to a string
const serializedXml = new XMLSerializer().serializeToString(xmlDoc);

// Convert the serialized XML string to Base64
const base64Xml = btoa(unescape(encodeURIComponent(serializedXml)));

export const VideoAudio = { config:`data:application/xml;base64,${base64Xml}`, tasks, annotation };
