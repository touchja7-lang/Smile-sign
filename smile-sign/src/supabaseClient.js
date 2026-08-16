import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Thai character to Latin romanization map
const THAI_ROMAN = {
  'ก':'k','ข':'kh','ค':'kh','ง':'ng','จ':'ch','ฉ':'ch','ช':'ch','ซ':'s','ญ':'y',
  'ฎ':'d','ฏ':'t','ฐ':'th','ฑ':'th','ฒ':'th','ณ':'n','ด':'d','ต':'t','ถ':'th',
  'ท':'th','ธ':'th','น':'n','บ':'b','ป':'p','ผ':'ph','ฝ':'f','พ':'ph','ฟ':'f',
  'ภ':'ph','ม':'m','ย':'y','ร':'r','ล':'l','ว':'w','ศ':'s','ษ':'s','ส':'s',
  'ห':'h','ฬ':'l','อ':'','ฮ':'h',
  'ะ':'a','า':'a','ิ':'i','ี':'i','ึ':'ue','ื':'ue','ุ':'u','ู':'u',
  'เ':'e','แ':'ae','โ':'o','ใ':'ai','ไ':'ai','็':'','่':'','้':'','๊':'','๋':'',
  'ั':'a','ำ':'am','ๆ':'-','์':'','ฯ':'',
  ' ':'-'
}

function romanizeThai(str) {
  if (!str) return 'unknown'
  return str
    .split('')
    .map(ch => THAI_ROMAN[ch] !== undefined ? THAI_ROMAN[ch] : ch)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 25) || 'file'
}

/**
 * Returns folder and file name parts based on current date
 * Folder: orders/YYYY-MM/
 * File:   YYYYMMDD_{customer}_{product}.{ext}
 */
function buildFilePath(file, context = {}) {
  const now = new Date()
  const yyyy = now.getFullYear()
  const mm   = String(now.getMonth() + 1).padStart(2, '0')
  const dd   = String(now.getDate()).padStart(2, '0')

  const folder   = `orders/${yyyy}-${mm}`                     // e.g. orders/2026-08
  const customer = romanizeThai(context.customerName)
  const product  = romanizeThai(context.productName)
  const fileExt  = file.name.split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '')
  const fileName = `${yyyy}${mm}${dd}_${customer}_${product}.${fileExt}` // e.g. 20260816_smchy_tufaiklm.jpg

  return `${folder}/${fileName}`
}

/**
 * Upload an artwork file to Supabase Storage
 *
 * Structure:
 *   artworks/
 *     orders/
 *       2026-08/
 *         20260816_smchy_tufaiklm.jpg
 *
 * @param {File} file
 * @param {Object} context - { customerName, productName }
 * @returns {Promise<string>} public URL
 */
export async function uploadArtwork(file, context = {}) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration is missing.')
  }

  const filePath = buildFilePath(file, context)

  const { error } = await supabase.storage
    .from('artworks')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    })

  if (error) {
    throw new Error('อัปโหลดไฟล์ล้มเหลว: ' + error.message)
  }

  const { data: publicUrlData } = supabase.storage
    .from('artworks')
    .getPublicUrl(filePath)

  return publicUrlData.publicUrl
}
