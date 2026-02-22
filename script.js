// JS Start
let interList = [];
let rjcList = [];

const total = document.getElementById('total');
const intr = document.getElementById('intr-count');
const rjc = document.getElementById('rjc-count');
const jobNumber = document.getElementById('job-number'); // Added

const allBtn = document.getElementById('all-btn');
const intrBtn = document.getElementById('intr-btn');
const rjcBtn = document.getElementById('rjc-btn');

const jobCard = document.getElementById('job-card');
const filterSection = document.getElementById('filtered-section');

// Calculate and update counts & job-number
function calculateCount() {
    const totalJobs = jobCard.children.length;
    const interviewJobs = interList.length;
    const rejectedJobs = rjcList.length;

    total.innerText = totalJobs;
    intr.innerText = interviewJobs;
    rjc.innerText = rejectedJobs;

    // Update job-number dynamically depending on selected tab
    if (allBtn.classList.contains('bg-blue-900')) {
        jobNumber.innerText = `${totalJobs} jobs`;
    } else if (intrBtn.classList.contains('bg-blue-900')) {
        jobNumber.innerText = `${interviewJobs} jobs`;
    } else if (rjcBtn.classList.contains('bg-blue-900')) {
        jobNumber.innerText = `${rejectedJobs} jobs`;
    }
}
calculateCount();

// Toggle button styles & show/hide sections
function toggleStyle(id) {
    [allBtn, intrBtn, rjcBtn].forEach(btn => {
        btn.classList.remove('bg-blue-900', 'text-white');
        btn.classList.add('bg-gray-300');
    });

    const selected = document.getElementById(id);
    selected.classList.remove('bg-gray-300');
    selected.classList.add('bg-blue-900', 'text-white');

    if (id === 'all-btn') {
        jobCard.classList.remove('hidden');
        filterSection.classList.add('hidden');
    } else if (id === 'intr-btn') {
        jobCard.classList.add('hidden');
        filterSection.classList.remove('hidden');
        renderFiltered(interList, "Interview");
    } else if (id === 'rjc-btn') {
        jobCard.classList.add('hidden');
        filterSection.classList.remove('hidden');
        renderFiltered(rjcList, "Rejected");
    }

    calculateCount();
}

// Button click events for toggling tabs
allBtn.addEventListener('click', () => toggleStyle('all-btn'));
intrBtn.addEventListener('click', () => toggleStyle('intr-btn'));
rjcBtn.addEventListener('click', () => toggleStyle('rjc-btn'));

// Event delegation for cards
document.querySelector('main').addEventListener('click', function(e) {
    const card = e.target.closest('.card');
    if (!card) return;

    const title = card.querySelector('.mblCorp').innerText;
    const role = card.querySelector('.reactDev').innerText;
    const remote = card.querySelector('.remote').innerText;
    const note = card.querySelector('.notes').innerText;

    // INTERVIEW
    if (e.target.classList.contains('in-btn')) {
        card.querySelector('.status').innerText = "Interview";
        rjcList = rjcList.filter(c => c.title !== title);
        if (!interList.find(c => c.title === title)) {
            interList.push({ title, role, remote, note });
        }
        calculateCount();
    }

    // REJECTED
    if (e.target.classList.contains('rj-btn')) {
        card.querySelector('.status').innerText = "Rejected";
        interList = interList.filter(c => c.title !== title);
        if (!rjcList.find(c => c.title === title)) {
            rjcList.push({ title, role, remote, note });
        }
        calculateCount();
    }

    // DELETE
    if (e.target.closest('.delete-btn')) {
        card.remove();
        interList = interList.filter(c => c.title !== title);
        rjcList = rjcList.filter(c => c.title !== title);
        calculateCount();
    }

    // Update filtered section dynamically
    if (!jobCard.classList.contains('hidden')) {
        filterSection.innerHTML = '';
    } else if (intrBtn.classList.contains('bg-blue-900')) {
        renderFiltered(interList, "Interview");
    } else if (rjcBtn.classList.contains('bg-blue-900')) {
        renderFiltered(rjcList, "Rejected");
    }
});

// Render filtered cards in filtered-section
function renderFiltered(list, status) {
    filterSection.innerHTML = '';

    if (list.length === 0) {
        filterSection.innerHTML = `
            <div class="text-center mt-10">
                <i class="fa-regular fa-folder-open text-4xl mb-3"></i>
                <p class="font-semibold">No jobs available</p>
                <p class="text-sm text-gray-500">No ${status} jobs found</p>
            </div>`;
        return;
    }

    list.forEach(job => {
        const div = document.createElement('div');
        div.className = "card bg-white p-5 rounded shadow my-4 flex justify-between";
        div.innerHTML = `
            <div>
                <h2 class="mblCorp font-bold text-lg">${job.title}</h2>
                <p class="reactDev text-gray-600 mb-2">${job.role}</p>
                <p class="remote text-gray-600 text-sm mb-2">${job.remote}</p>
                <p class="status font-semibold mb-2">${status}</p>
                <p class="notes text-gray-800 text-sm mb-2">${job.note}</p>
                <div class="flex gap-3">
                    <button class="in-btn border border-green-700 text-green-700 font-bold py-1 px-3 rounded">INTERVIEW</button>
                    <button class="rj-btn border border-red-700 text-red-700 font-bold py-1 px-3 rounded">REJECTED</button>
                </div>
            </div>
            <button class="delete-btn text-red-500"><i class="fa-regular fa-trash-can text-lg"></i></button>
        `;
        filterSection.appendChild(div);
    });
}

// Default selected tab
allBtn.classList.add('bg-blue-900', 'text-white');
intrBtn.classList.add('bg-gray-300');
rjcBtn.classList.add('bg-gray-300');