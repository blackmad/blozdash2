/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from 'firebase-functions';
// import { Storage } from '@google-cloud/storage';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import { Client, LogLevel } from '@notionhq/client';
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';
import { onRequest } from 'firebase-functions/v1/https';

// firebase functions:config:set notion.key="secret_wSIRduBvqcqQpJbopxaXxegAUBsFHTBm8htCRekDgY0" google.bucket_name="blozdash"

const NotionSecret = functions.config().notion.key;
const DatabaseId = functions.config().notion.database_id;
const BucketName = functions.config().google.bucket_name;

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

// function simplifyNotionResponseToPropertyNameDict(
//   response: QueryDatabaseResponse,
// ): SimplifiedPage[] {
//   return response.results.map((semiTypedPage) => {
//     const page = semiTypedPage as PageObjectResponse;

//     let title: string = '';

//     const properties: Record<string, any> = {};
//     for (const [key, value] of Object.entries(page.properties)) {
//       if (value.type === 'title') {
//         title = value.title[0].plain_text;
//       } else if (value.type === 'rich_text') {
//         properties[key] = value.rich_text[0]?.plain_text || '';
//       } else if (value.type === 'number') {
//         properties[key] = value.number;
//       } else if (value.type === 'select') {
//         properties[key] = value.select?.name;
//       } else if (value.type === 'multi_select') {
//         properties[key] = value.multi_select.map((v: any) => v.name);
//       } else if (value.type === 'files') {
//         properties[key] = value.files.map((v: any) => {
//           return {
//             name: v.name,
//             url: v.file?.url,
//           };
//         });
//       }
//     }

//     return {
//       id: page.id,
//       title,
//       properties,
//     };
//   });
// }

type SimplifiedPropertyTypeResponse = {
  id: string;
  properties: {
    title?: string;
    rich_text?: string;
    number?: number;
    select?: string;
    multi_select?: string[];
    files?: { name: string; url: string }[];
  };
};

function simplifyNotionResponseToPropertyTypeDict(
  response: QueryDatabaseResponse,
): SimplifiedPage[] {
  return response.results.map((semiTypedPage) => {
    const page = semiTypedPage as PageObjectResponse;

    let title: string = '';

    const properties: Record<string, SimplifiedPropertyTypeResponse> = {};

    for (const [_key, value] of Object.entries(page.properties)) {
      function setProperty(extractedValue: any) {
        const valueType = value.type;
        // console.log({ value });
        if (properties[valueType]) {
          throw new Error(`Duplicate property found: ${valueType}`);
        }
        properties[valueType] = extractedValue;
      }

      console.log({ value });

      if (value.type === 'title') {
        setProperty(value.title[0]?.plain_text);
      } else if (value.type === 'rich_text') {
        setProperty(value.rich_text[0]?.plain_text || '');
      } else if (value.type === 'number') {
        setProperty(value.number);
      } else if (value.type === 'select') {
        setProperty(value.select?.name);
      } else if (value.type === 'multi_select') {
        setProperty(value.multi_select.map((v: any) => v.name));
      } else if (value.type === 'files') {
        const files = value.files.map((v: any) => {
          return {
            name: v.name,
            url: v.file?.url,
          };
        });
        if (files.length > 0) {
          setProperty(files);
        }
      }
    }

    return {
      id: page.id,
      title,
      properties,
    };
  });
}

// async function uploadFile({
//   contents,
//   filename,
// }: {
//   contents: string;
//   filename: string;
// }): Promise<void> {
//   // Creates a client
//   const bucket = storage.bucket(BucketName);
//   const file = bucket.file(filename);

//   // Writes the file
//   await file.save(contents);

//   console.log(`File ${filename} has been uploaded to ${BucketName}.`);
// }

async function readNotionDatabase(databaseId: string): Promise<any> {
  const response = await notion.databases.query({
    database_id: databaseId,
  });

  // Convert the response to JSON
  // const json = JSON.stringify(response, null, 2);

  const fixedJson = simplifyNotionResponseToPropertyTypeDict(response);
  console.log({ fixedJson });

  // Write the JSON to a file
  // require('fs').writeFileSync('output.json', json);
  // require('fs').writeFileSync('fixed-output.json', fixedJson);

  return fixedJson;
}

exports.scheduledFunction = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(() => {
    console.log('This will be run every 5 minutes!');
    readNotionDatabase(DatabaseId);
    return null;
  });

exports.readDb = onRequest(async (req, res) => {
  const flattenedDb = await readNotionDatabase(DatabaseId);
  res.json(flattenedDb);
});

// Use the function
// readNotionDatabase(DatabaseId);
