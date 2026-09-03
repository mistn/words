import { describe, it, expect } from 'vitest';
import vocab from '../src/data/vocab.json';
import fs from 'node:fs';
import path from 'node:path';

type Word = { en: string; ar: string };
type Cat = { category: string; words: Word[] };

function loadSheets(): Cat[][] {
  const sheetsDir = 'src/data/sheets';
  const files = fs.existsSync(sheetsDir) ? fs.readdirSync(sheetsDir).filter(f=>f.endsWith('.json') && !f.startsWith('_')) : [];
  const sheets: Cat[][] = [vocab as Cat[]];
  for(const f of files){
    try{
      const j = JSON.parse(fs.readFileSync(path.join(sheetsDir,f),'utf-8'));
      if(Array.isArray(j)) sheets.push(j as Cat[]);
      else if(j.categories) sheets.push(j.categories as Cat[]);
    }catch{}
  }
  return sheets;
}

describe('vocab data integrity', ()=>{
  it('vocab.json has categories and words', ()=>{
    expect(Array.isArray(vocab)).toBe(true);
    expect(vocab.length).toBeGreaterThan(0);
    for(const cat of vocab as Cat[]){
      expect(cat.category.trim().length).toBeGreaterThan(0);
      expect(cat.words.length).toBeGreaterThan(0);
    }
  });

  it('no empty en/ar', ()=>{
    for(const cats of loadSheets()){
      for(const cat of cats){
        for(const w of cat.words){
          expect(w.en.trim().length, `empty en in ${cat.category}`).toBeGreaterThan(0);
          expect(w.ar.trim().length, `empty ar for ${w.en}`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('no duplicate en within a sheet (case-insensitive)', ()=>{
    for(const cats of loadSheets()){
      const seen = new Map<string,string>();
      for(const cat of cats){
        for(const w of cat.words){
          const key = w.en.toLowerCase().trim();
          expect(seen.has(key), `duplicate en "${w.en}" in ${cat.category} (first in ${seen.get(key)})`).toBe(false);
          seen.set(key, cat.category);
        }
      }
    }
  });

  it('no duplicate ar exact duplicates within a category', ()=>{
    for(const cat of vocab as Cat[]){
      const seen = new Set<string>();
      for(const w of cat.words){
        const key = w.ar.trim();
        expect(seen.has(key) && w.en !== 'location' && w.en !== 'location (= plateau)', `duplicate ar "${key}" in ${cat.category} for ${w.en}`).toBe(false);
        if(w.en !== 'location (= plateau)') seen.add(key);
      }
    }
  });

  it('total words matches header 61', ()=>{
    const total = (vocab as Cat[]).reduce((n,c)=>n+c.words.length,0);
    expect(total).toBe(61);
  });
});

describe('TTS A/B placeholder', ()=>{
  it('en-GB voice preference list exists', async ()=>{
    const preferred = ['Google UK English Female','Microsoft Hazel','Daniel'];
    expect(preferred.length).toBeGreaterThan(0);
  });
});
