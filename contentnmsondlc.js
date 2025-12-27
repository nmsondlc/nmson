/* ================== EXPORT ================== */
function exportExcelKeepOriginal(data){
  const ws = XLSX.utils.json_to_sheet(data, {
    skipHeader: false   // giữ nguyên tên cột
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "DVKT");
  XLSX.writeFile(wb, "dvkt_xep_lich_nguyen_trang.xlsx");
}
function exportExcel(arr){

 const rows=arr.map((d,i)=>({
  STT:i+1,
  MA_BN:d.MA_BN,
  TEN_BN:d.TEN_BN,
  MA_DV:d.MA_DV,
  TEN_DV:d.TEN_DV,
  TG_CHI_DINH:d.TG_CHI_DINH,
  PHAUTHUATVIEN:d.PHAUTHUATVIEN,
  BAT_DAU:d.NGAYPHAUTHUATTHUTHUAT||"",
  KET_THUC:d.KETTHUCPTTT||""
 }));
 const ws=XLSX.utils.json_to_sheet(rows);
 const wb=XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(wb,ws,"DVKT");
 XLSX.writeFile(wb,"dvkt_chia_lich.xlsx");
}











/* ================== TIME UTILS ================== */
function timeToMin(s){
 if(!s) return null;
 const m=s.match(/(\d{1,2}):(\d{2})/);
 return m?Number(m[1])*60+Number(m[2]):null;
}
function minToTime(m){
 const h=String(Math.floor(m/60)).padStart(2,'0');
 const mm=String(m%60).padStart(2,'0');
 return `${h}:${mm}`;
}

/* ================== BUILD BUSY MAP ================== */
function buildBnBusy(list){
 const m={};
 list.forEach(d=>{
  if(d.CHECKED===true && d.NGAYPHAUTHUATTHUTHUAT){
   const st=timeToMin(d.NGAYPHAUTHUATTHUTHUAT);
   const en=timeToMin(d.KETTHUCPTTT);
   if(st!=null && en!=null){
    m[d.MA_BN]=m[d.MA_BN]||[];
    m[d.MA_BN].push({start:st,end:en});
   }
  }
 });
 return m;
}

function buildKtvBusy(list){
 const m={};
 list.forEach(d=>{
  if(d.CHECKED===true && d.PHAUTHUATVIEN){
   const st=timeToMin(d.NGAYPHAUTHUATTHUTHUAT);
   if(st!=null){
    d.PHAUTHUATVIEN.split(";").map(x=>x.trim()).filter(Boolean).forEach(k=>{
     m[k]=m[k]||[];
     m[k].push({start:st, gap:d.SO_PHUT_KTV||0});
    });
   }
  }
 });
 return m;
}

/* ================== CORE ================== */
function chiaLich(ktv, dvkt) {

  const list = dvkt.map(d => ({ ...d, CHECKED: d.CHECKED === true }));

  const bnBusy = buildBnBusy(list);     // { MA_BN: [{start,end}] }
  const ktvBusy = buildKtvBusy(list);   // { MA_KTV: [{start,end}] }
  const ktvShift = buildKtvShift(ktv);  // { MA_KTV: [{start,end}] }

  /* ===== SORT ===== */
  const need = list
    .map((d, i) => ({ d, i }))
    .filter(x => x.d.CHECKED !== true)
    .sort((a, b) => {
      const ta = timeToMin(a.d.TG_CHI_DINH);
      const tb = timeToMin(b.d.TG_CHI_DINH);
      if (ta == null && tb != null) return 1;
      if (ta != null && tb == null) return -1;
      if (ta != null && tb != null && ta !== tb) return ta - tb;
      return (a.d.MA_DV || "").localeCompare(b.d.MA_DV || "");
    });

  /* ===== SCHEDULE ===== */
  need.forEach(({ d, i }) => {

    let t0 = timeToMin(d.TG_CHI_DINH);
    if (t0 == null) return;

    const bn = d.MA_BN;
    bnBusy[bn] = bnBusy[bn] || [];

    const ktvList = (d.PHAUTHUATVIEN || "")
      .split(";").map(x => x.trim()).filter(Boolean);

    const candidates = ktvList.length ? ktvList : [null];
    let best = null;

    candidates.forEach(ktvId => {

      const shifts = ktvId
        ? (ktvShift[ktvId] || [])
        : [{ start: t0, end: 1440 }];

      ktvBusy[ktvId] = ktvBusy[ktvId] || [];

      shifts.forEach(shift => {

        let cur = Math.max(t0, shift.start);
        let loop = 0;

        while (loop++ < 500) {

          /* ❌ vượt ca KTV */
          if (cur + d.SO_PHUT_BN > shift.end) break;

          let moved = false;

          /* ❌ BN trùng */
          for (const b of bnBusy[bn]) {
            if (cur < b.end && cur + d.SO_PHUT_BN > b.start) {
              cur = b.end + 2;
              moved = true;
              break;
            }
          }
          if (moved) continue;

          /* ❌ KTV trùng (CHỈ SO_PHUT_KTV) */
          if (ktvId) {
            for (const k of ktvBusy[ktvId]) {
              if (cur < k.end && cur + d.SO_PHUT_KTV > k.start) {
                cur = k.end;
                moved = true;
                break;
              }
            }
            if (moved) continue;
          }

          /* ✅ hợp lệ */
          if (!best || cur < best.start) {
            best = { start: cur, ktv: ktvId };
          }
          break;
        }
      });
    });

    if (!best) return;

    const endBN = best.start + d.SO_PHUT_BN;
    const endKTV = best.start + (d.SO_PHUT_KTV || 0);

    list[i].CHECKED = 'DONE';
    list[i].NGAYPHAUTHUATTHUTHUAT = minToTime(best.start);
    list[i].KETTHUCPTTT = minToTime(endBN);
    if (best.ktv) list[i].PHAUTHUATVIEN = best.ktv;

    /* lưu busy */
    bnBusy[bn].push({ start: best.start, end: endBN });

    if (best.ktv) {
      ktvBusy[best.ktv].push({
        start: best.start,
        end: endKTV
      });
    }
  });

  return list;
}



function buildKtvShift(ktv){
 const m={};
 ktv.forEach(k=>{
  if(!m[k.MA_BS]) m[k.MA_BS]=[];
  m[k.MA_BS].push({
   start: timeToMin(k.BAT_DAU),
   end:   timeToMin(k.KET_THUC)
  });
 });
 return m;
}
