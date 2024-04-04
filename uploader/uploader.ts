// TODO
// massage this into types
// upload images to s3

import unreachable from 'ts-unreachable';

import { Client, LogLevel } from '@notionhq/client';
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import AWS from 'aws-sdk';
import { isNotNull, isNotUndefined } from 'typesafe-utils';
import { DataEntry, isValidCardType } from '../src/data';

// firebase functions:config:set notion.key="" google.bucket_name="blozdash"

const NotionSecret = 'secret_kNK302VIEvHiruxUPWvJotTTIIYSN7WeBgDKMVjRhBB';
const DatabaseId = '6631e610f0384c4c91ef678932b88097';
const BucketName = '6631e610f0384c4c91ef678932b88097';

if (!NotionSecret) {
  throw new Error('Notion Secret is not set');
}
if (!DatabaseId) {
  throw new Error('Database Id is not set');
}
if (!BucketName) {
  throw new Error('Bucket Name is not set');
}

// Initialize Notion Client
const notion = new Client({
  auth: NotionSecret,
  logLevel: LogLevel.DEBUG,
});

// const storage = new Storage();

type SimplifiedPage = {
  id: string;
  title: string;
  properties: Record<string, any>;
};

function notionResponseToDataEntries(
  response: QueryDatabaseResponse,
): DataEntry[] {
  const simplifiedDicts = simplifyNotionResponseToPropertyNameDict(response);

  return simplifiedDicts
    .map((simplifiedDict) => {
      const { cardType } = simplifiedDict.properties;
      if (!isValidCardType(cardType)) {
        console.warn(`Invalid card type: ${cardType}`);
        return;
      }

      if (cardType === 'image') {
      } else {
        unreachable(cardType);
      }

      return undefined;
    })
    .filter(isNotUndefined);
}

function simplifyNotionResponseToPropertyNameDict(
  response: QueryDatabaseResponse,
): SimplifiedPage[] {
  return response.results.map((semiTypedPage) => {
    const page = semiTypedPage as PageObjectResponse;

    let title = '';

    const properties: Record<string, any> = {};
    for (const [key, value] of Object.entries(page.properties)) {
      if (value.type === 'title') {
        title = value.title[0]?.plain_text;
      } else if (value.type === 'rich_text') {
        properties[key] = value.rich_text[0]?.plain_text || '';
      } else if (value.type === 'number') {
        properties[key] = value.number;
      } else if (value.type === 'select') {
        properties[key] = value.select?.name;
      } else if (value.type === 'date') {
        properties[key] = value.date;
      } else if (value.type === 'multi_select') {
        properties[key] = value.multi_select.map((v: any) => v.name);
      } else if (value.type === 'files') {
        properties[key] = value.files.map((v: any) => {
          return {
            name: v.name,
            url: v.file?.url,
          };
        });
      }
    }

    return {
      id: page.id,
      title,
      properties,
    };
  });
}

async function uploadFile({
  url,
  filename,
}: {
  url: string;
  filename: string;
}): Promise<void> {
  // Download file from url and upload it to s3
  const response = await fetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());

  const params = {
    Bucket: BucketName,
    Key: filename,
    Body: buffer,
    // public perms
    ACL: 'public-read',
  };
  const s3 = new AWS.S3();
  const s3Response = await s3.upload(params).promise();
  console.log(s3Response.Location);

  console.log(`File ${filename} has been uploaded to ${BucketName}.`);
}

async function readNotionDatabase(databaseId: string): Promise<any> {
  const response = await notion.databases.query({
    database_id: databaseId,
    // sorts: [
    //   {
    //     property: 'Last ordered',
    //     direction: 'ascending',
    //   },
    // ],
  });

  const fixedJson = notionResponseToDataEntries(response);
  // go through everything and upload to s3
  // for (const page of fixedJson) {
  //   const images = page.properties.Images;
  //   for (const item of images) {
  //     if (item.url) {
  //       await uploadFile({
  //         url: item.url,
  //         filename: item.name,
  //       });
  //     }
  //   }
  // }

  console.log(JSON.stringify(fixedJson, null, 2));

  // Write the JSON to a file
  // require('fs').writeFileSync('output.json', json);
  // require('fs').writeFileSync('fixed-output.json', fixedJson);

  return fixedJson;
}

async function uploadDataToS3(data: any) {
  // upload json
  const params = {
    Bucket: BucketName,
    Key: 'data.json',
    Body: Buffer.from(JSON.stringify(data, null, 2), 'utf-8'),
    // public perms
    ACL: 'public-read',
    // add json content type
    ContentType: 'application/json',
  };
  const s3 = new AWS.S3();
  const s3Response = await s3.upload(params).promise();
  console.log(s3Response.Location);
}

async function readAndUpload() {
  const fixedJson = await readNotionDatabase(DatabaseId);
  uploadDataToS3(fixedJson);
}

readAndUpload();
