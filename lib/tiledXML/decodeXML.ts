import { XMLParser } from 'fast-xml-parser';
import { XML_NUMERIC_ATTRIBUTES, XML_TO_JSON_ATTRIBUTES } from './properties';

export const decodeXML = (data: Buffer | string): unknown[] =>
  new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    ignorePiTags: true,
    textNodeName: 'rawData',
    // transformTagName: (name) => TAG_NAME_DICTIONARY[name] || name,
    transformAttributeName: (name) => XML_TO_JSON_ATTRIBUTES[name] || name,
    attributeValueProcessor: (attrName, value) => (XML_NUMERIC_ATTRIBUTES.includes(attrName) ? Number(value) : undefined),
    // isArray: (name) => ARRAY_TAGS.includes(name),
    preserveOrder: true,
  }).parse(data);
