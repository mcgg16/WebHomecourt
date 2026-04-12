export const adminStats = {
  reportsPending: 12,
  usersFlagged: 17,
  eventsFlagged: 3,
  suspendedUsers: 5,
}

export const userReports = [
  { id: '#342', event: 'Pickup Game',     reportedUser: 'wicho',      priority: 'High',   status: 'Pending' },
  { id: '#338', event: '3V3 Tournament',  reportedUser: 'AdolfGOD',   priority: 'Medium', status: 'Pending' },
  { id: '#345', event: '5v5 League',      reportedUser: 'skymaligna', priority: 'High',   status: 'Reviewed' },
  { id: '#421', event: 'Pickup Game',     reportedUser: 'regigi',     priority: 'Low',    status: 'Resolved' },
  { id: '#541', event: '3v3 Tournament',  reportedUser: 'monica',     priority: 'Low',    status: 'Pending' },
]

export const activeEvents = [
  { id: 1, name: 'Pickup Game',    status: 'Active', host: '@AdolfGOD', location: 'Venice Beach',   players: 20 },
  { id: 2, name: '3v3 Tournament', status: 'New',    host: '@regigi',   location: 'Downtown LA',    players: 10 },
  { id: 3, name: 'Pickup Game',    status: 'Active', host: '@skymaligna', location: 'Santa Monica', players: 15 },
]

export const eventReports = [
  { id: '#642', event: 'Pickup Game',    location: 'Santa Monica', host: 'monica',     reports: 3, priority: 'High',   status: 'Reviewed' },
  { id: '#638', event: '5v5 League',     location: 'Downtown LA',  host: 'wicho',      reports: 5, priority: 'Medium', status: 'Pending' },
  { id: '#645', event: '3v3 Tournament', location: 'Venice Beach', host: 'AdolfGOD',   reports: 7, priority: 'High',   status: 'Reviewed' },
  { id: '#621', event: 'Pickup Game',    location: 'Echo Park',    host: 'THE_GOAT',   reports: 4, priority: 'Medium', status: 'Resolved' },
  { id: '#641', event: '3v3 Tournament', location: 'Santa Monica', host: 'pondpigeon', reports: 1, priority: 'Low',    status: 'Pending' },
]

export const reportDetails = {
  id: '#345',
  event: 'Pickup Game',
  location: 'Venice Beach',
  date: 'Mar 21, 2026 • 6:00PM',
  participants: 15,
  comment: 'The player kept insulting their teammates and even pulled someone\'s hair. They played very rough.',
  reportedUser: {
    name: 'skymaligna',
    rating: 2.9,
    totalReports: 4,
  },
  history: [
    { event: '3v3 Tournament', date: 'Feb 14', rating: 2.5, tags: ['Aggressive', 'Insulting'] },
    { event: 'Pickup Game',    date: 'Feb 10', rating: 2.0, tags: ['Toxic', 'Hurtful'] },
  ]
}