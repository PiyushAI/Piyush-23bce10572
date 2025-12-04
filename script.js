// Simple Course Registration demo storing data in localStorage
const STORE_KEY = 'crs_data_v1';

function uid(prefix='id'){ return prefix + '_' + Math.random().toString(36).slice(2,9); }

const DataStore = {
  load() {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return {courses:[], students:[], registrations:[]};
    try { return JSON.parse(raw); } catch(e){ return {courses:[], students:[], registrations:[]}; }
  },
  save(state) { localStorage.setItem(STORE_KEY, JSON.stringify(state)); },
  getCourses() { return this.load().courses; },
  getStudents() { return this.load().students; },
  getRegistrations() { return this.load().registrations; },
  addOrUpdateCourse(course) {
    const s = this.load();
    const idx = s.courses.findIndex(c => c.id === course.id || c.code===course.code);
    if (idx>=0) s.courses[idx] = {...s.courses[idx], ...course};
    else s.courses.push({...course, id:course.id||uid('c')});
    this.save(s);
  },
  deleteCourse(id) {
    const s = this.load();
    s.courses = s.courses.filter(c=>c.id!==id);
    s.registrations = s.registrations.filter(r=>r.courseId!==id);
    this.save(s);
  },
  addOrUpdateStudent(student) {
    const s = this.load();
    const idx = s.students.findIndex(st => st.id===student.id || st.rollNo===student.rollNo);
    if (idx>=0) s.students[idx] = {...s.students[idx], ...student};
    else s.students.push({...student, id:student.id||uid('s')});
    this.save(s);
  },
  deleteStudent(id) {
    const s = this.load();
    s.students = s.students.filter(st=>st.id!==id);
    s.registrations = s.registrations.filter(r=>r.studentId!==id);
    this.save(s);
  },
  register(studentId, courseId) {
    const s = this.load();
    if (!s.students.find(x=>x.id===studentId)) return {ok:false,msg:'Student not found'};
    if (!s.courses.find(x=>x.id===courseId)) return {ok:false,msg:'Course not found'};
    if (s.registrations.find(r=>r.studentId===studentId && r.courseId===courseId))
      return {ok:false,msg:'Student already registered for this course'};
    const reg = {id:uid('reg'), studentId, courseId, timestamp:new Date().toISOString()};
    s.registrations.push(reg);
    this.save(s);
    return {ok:true, reg};
  },
  unregister(regId) {
    const s = this.load();
    s.registrations = s.registrations.filter(r=>r.id!==regId);
    this.save(s);
  },
  exportJSON() { return JSON.stringify(this.load(), null, 2); },
  importJSON(jsonText) {
    try {
      const parsed = JSON.parse(jsonText);
      if (!parsed.courses || !parsed.students || !parsed.registrations) throw new Error('Structure missing');
      localStorage.setItem(STORE_KEY, JSON.stringify(parsed));
      return {ok:true};
    } catch(e) { return {ok:false, msg:e.message}; }
  },
  clearAll() { localStorage.removeItem(STORE_KEY); }
};

// ----- UI helpers -----
function el(id){ return document.getElementById(id); }
function showMsg(text, cls='success'){ 
  const m = document.createElement('div'); 
  m.className=`msg ${cls}`; 
  m.textContent=text; 
  const cont = el('messages'); 
  if (!cont) return;
  cont.innerHTML=''; 
  cont.appendChild(m); 
  setTimeout(()=>{
    m.style.opacity = '0';
    m.style.transform = 'translateY(-10px)';
    setTimeout(()=>cont.innerHTML='', 300);
  }, 4000); 
}

// Populate lists
function refreshAll() {
  const ds = DataStore.load();
  // courses
  const courseList = el('courseList'); courseList.innerHTML='';
  if (ds.courses.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.innerHTML = '<div>No courses added yet. Add your first course above!</div>';
    courseList.appendChild(empty);
  } else {
    ds.courses.forEach(c=>{
      const li = document.createElement('li');
      li.innerHTML = `<div><strong>${c.code}</strong> — ${c.title} <span class="badge">${c.credits} cr</span></div>`;
      const btns = document.createElement('div');
      btns.className = 'btn-group';
      const edit = document.createElement('button'); 
      edit.textContent='✏️ Edit'; 
      edit.className='btn-small btn-secondary'; 
      edit.onclick=()=>{ 
        el('courseCode').value=c.code; 
        el('courseTitle').value=c.title; 
        el('courseCredits').value=c.credits; 
        el('courseForm').dataset.editId=c.id;
        el('courseCode').focus();
        showMsg('Course loaded for editing', 'info');
      };
      const del = document.createElement('button'); 
      del.textContent='🗑️ Delete'; 
      del.className='btn-small btn-danger'; 
      del.onclick=()=>{ 
        if(confirm(`Delete course "${c.code} - ${c.title}"? This will also remove all registrations for this course.`)){ 
          DataStore.deleteCourse(c.id); 
          refreshAll();
          showMsg('Course deleted successfully');
        } 
      };
      btns.appendChild(edit); btns.appendChild(del); li.appendChild(btns);
      courseList.appendChild(li);
    });
  }

  // students
  const studentList = el('studentList'); studentList.innerHTML='';
  if (ds.students.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.innerHTML = '<div>No students added yet. Add your first student above!</div>';
    studentList.appendChild(empty);
  } else {
    ds.students.forEach(s=>{
      const li = document.createElement('li');
      li.innerHTML = `<div><strong>${s.rollNo}</strong> — ${s.name} <small>${s.email}</small></div>`;
      const btns = document.createElement('div');
      btns.className = 'btn-group';
      const edit = document.createElement('button'); 
      edit.textContent='✏️ Edit'; 
      edit.className='btn-small btn-secondary'; 
      edit.onclick=()=>{ 
        el('studentRoll').value=s.rollNo; 
        el('studentName').value=s.name; 
        el('studentEmail').value=s.email; 
        el('studentForm').dataset.editId=s.id;
        el('studentRoll').focus();
        showMsg('Student loaded for editing', 'info');
      };
      const del = document.createElement('button'); 
      del.textContent='🗑️ Delete'; 
      del.className='btn-small btn-danger'; 
      del.onclick=()=>{ 
        if(confirm(`Delete student "${s.name} (${s.rollNo})"? This will also remove all their registrations.`)){ 
          DataStore.deleteStudent(s.id); 
          refreshAll();
          showMsg('Student deleted successfully');
        } 
      };
      btns.appendChild(edit); btns.appendChild(del); li.appendChild(btns);
      studentList.appendChild(li);
    });
  }

  // populate selects for registration and filters
  const regStudent = el('regStudent'); const regCourse = el('regCourse');
  const filterStudent = el('filterStudent'); const filterCourse = el('filterCourse');
  [regStudent, filterStudent].forEach(sel=>{
    sel.innerHTML = '<option value="">Select student</option>';
    ds.students.forEach(s => sel.appendChild(new Option(`${s.name} (${s.rollNo})`, s.id)));
  });
  [regCourse, filterCourse].forEach(sel=>{
    sel.innerHTML = '<option value="">Select course</option>';
    ds.courses.forEach(c => sel.appendChild(new Option(`${c.code} — ${c.title}`, c.id)));
  });

  // registrations list
  const regs = ds.registrations;
  const regList = el('regList'); regList.innerHTML='';
  const fS = el('filterStudent').value, fC = el('filterCourse').value;
  const filteredRegs = regs.filter(r=> (fS? r.studentId===fS:true) && (fC? r.courseId===fC:true));
  
  if (filteredRegs.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    const filterMsg = (fS || fC) ? 'No registrations match the current filters.' : 'No registrations yet. Register a student for a course above!';
    empty.innerHTML = `<div>${filterMsg}</div>`;
    regList.appendChild(empty);
  } else {
    filteredRegs.forEach(r=>{
      const st = ds.students.find(s=>s.id===r.studentId) || {name:'?', rollNo:''}; 
      const co = ds.courses.find(c=>c.id===r.courseId) || {code:'?', title:'?'};
      const li = document.createElement('li'); 
      li.innerHTML = `<div><strong>${st.name}</strong> (${st.rollNo}) → <strong>${co.code}</strong>: ${co.title} <small>Registered: ${new Date(r.timestamp).toLocaleString()}</small></div>`;
      const btns = document.createElement('div'); 
      btns.className = 'btn-group';
      const del = document.createElement('button'); 
      del.textContent='❌ Unregister'; 
      del.className='btn-small btn-danger'; 
      del.onclick=()=>{ 
        if(confirm(`Remove registration: ${st.name} from ${co.code}?`)){ 
          DataStore.unregister(r.id); 
          refreshAll();
          showMsg('Registration removed successfully');
        } 
      };
      btns.appendChild(del); li.appendChild(btns); regList.appendChild(li);
    });
  }
  
  // Update registration count in heading if exists
  const regHeading = document.querySelector('#registration-heading');
  if (regHeading) {
    const count = regs.length;
    regHeading.innerHTML = `📝 Register${count > 0 ? ` <span class="badge">${count}</span>` : ''}`;
  }
}

// form handlers
document.addEventListener('DOMContentLoaded',()=>{
  refreshAll();

  el('courseForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const code = el('courseCode').value.trim().toUpperCase(), 
          title = el('courseTitle').value.trim(), 
          credits = Number(el('courseCredits').value);
    if(!code||!title||isNaN(credits)||credits<0){ 
      showMsg('Please fill all course fields correctly. Credits must be a positive number.','error'); 
      return; 
    }
    const editId = el('courseForm').dataset.editId;
    const isEdit = !!editId;
    DataStore.addOrUpdateCourse({id: editId, code, title, credits});
    el('courseForm').reset(); 
    delete el('courseForm').dataset.editId;
    showMsg(isEdit ? `Course "${code}" updated successfully` : `Course "${code}" added successfully`);
    refreshAll();
  });

  el('studentForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const roll = el('studentRoll').value.trim(), 
          name = el('studentName').value.trim(), 
          email = el('studentEmail').value.trim();
    if(!roll||!name||!email){ 
      showMsg('Please fill all student fields correctly','error'); 
      return; 
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
      showMsg('Please enter a valid email address','error');
      return;
    }
    const editId = el('studentForm').dataset.editId;
    const isEdit = !!editId;
    DataStore.addOrUpdateStudent({id: editId, rollNo: roll, name, email});
    el('studentForm').reset(); 
    delete el('studentForm').dataset.editId;
    showMsg(isEdit ? `Student "${name}" updated successfully` : `Student "${name}" added successfully`);
    refreshAll();
  });

  el('btnRegister').addEventListener('click', ()=>{
    const sid = el('regStudent').value, cid = el('regCourse').value;
    if(!sid || !cid){ 
      showMsg('Please select both a student and a course','error'); 
      return; 
    }
    const r = DataStore.register(sid, cid);
    if(!r.ok) {
      showMsg(r.msg,'error');
    } else {
      const ds = DataStore.load();
      const st = ds.students.find(s=>s.id===sid);
      const co = ds.courses.find(c=>c.id===cid);
      showMsg(`Successfully registered ${st.name} for ${co.code}`);
    }
    refreshAll();
  });

  el('btnFilter').addEventListener('click', ()=> refreshAll());

  el('btnExport').addEventListener('click', ()=>{
    const data = DataStore.exportJSON();
    const blob = new Blob([data], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'crs_export.json'; a.click(); URL.revokeObjectURL(url);
    showMsg('Exported JSON');
  });

  el('importFile').addEventListener('change', (ev)=>{
    const f = ev.target.files[0]; if(!f) return;
    const reader = new FileReader();
    reader.onload = (e)=>{
      const r = DataStore.importJSON(e.target.result);
      if(!r.ok) showMsg('Import failed: ' + (r.msg||'invalid'),'error'); else { showMsg('Imported successfully'); refreshAll(); }
    };
    reader.readAsText(f);
  });

  el('btnClear')?.addEventListener('click', ()=>{
    if(confirm('Are you sure you want to clear all data? This action cannot be undone.')){
      DataStore.clearAll();
      showMsg('All data cleared');
      refreshAll();
    }
  });

});
