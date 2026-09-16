export const REVIEW_STATUSES=['pending','approved','revise','rejected'];
export const REVIEW_KINDS=['design','animation'];
export function reviewKey(r){return [r.familyId,r.frame,r.kind,r.revision].join('::')}
export function activeReview(records,family,frame,kind='design'){return records.find(r=>reviewKey(r)===reviewKey({familyId:family.id,frame,kind,revision:family.revision}))||null}
export function validateRecord(record,catalog){
 const f=catalog.families.find(f=>f.id===record.familyId);
 if(!f||!Number.isInteger(record.frame)||record.frame<0||record.frame>=f.frames)throw Error('Unknown family or frame.');
 if(record.revision!==f.revision)throw Error('Artwork revision differs; stale approval was not applied.');
 if(!REVIEW_STATUSES.includes(record.status)||!REVIEW_KINDS.includes(record.kind))throw Error('Invalid review status or kind.');
 if(typeof record.notes!=='string'||record.notes.length>4000)throw Error('Invalid notes.');
 if(['revise','rejected'].includes(record.status)&&!record.notes.trim())throw Error('Add a note explaining the requested change.');
 if(typeof record.updatedAt!=='string'||!Number.isFinite(Date.parse(record.updatedAt)))throw Error('Invalid review date.');
 return {familyId:f.id,frame:record.frame,revision:f.revision,kind:record.kind,status:record.status,notes:record.notes,updatedAt:record.updatedAt};
}
export function applyRecord(records,record,catalog){const checked=validateRecord(record,catalog),key=reviewKey(checked),old=records.find(r=>reviewKey(r)===key);if(old&&Date.parse(old.updatedAt)>Date.parse(checked.updatedAt))return records.slice();return [...records.filter(r=>reviewKey(r)!==key),checked]}
export function importRecords(records,payload,catalog){
 if(payload?.schemaVersion!==1||payload.catalogId!==catalog.catalogId||!Array.isArray(payload.records)||payload.records.length>20000)throw Error('This is not a compatible GOD MODE review file.');
 const checked=payload.records.map(r=>validateRecord(r,catalog));return checked.reduce((all,r)=>applyRecord(all,r,catalog),records.slice());
}
export function exportRecords(records,catalog){return {schemaVersion:1,catalogId:catalog.catalogId,records,exportedAt:new Date().toISOString()}}
export function referenceNumbers(catalog,numbers){return numbers.map(n=>{const ref=catalog.references.find(r=>r.number===n);if(!ref)throw Error('Unknown reference number '+n);return ref})}
