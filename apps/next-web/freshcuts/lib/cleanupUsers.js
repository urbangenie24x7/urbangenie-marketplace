import { db } from './firebase'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'

export async function cleanupDuplicateUsers() {
  try {
    // Get all users
    const usersSnap = await getDocs(collection(db, 'users'))
    const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    if (users.length === 0) {
      return { success: true, message: 'No users found in database' }
    }

    // Group users by phone number
    const phoneGroups = {}
    users.forEach(user => {
      if (user.phone) {
        if (!phoneGroups[user.phone]) {
          phoneGroups[user.phone] = []
        }
        phoneGroups[user.phone].push(user)
      }
    })

    let duplicatesFound = 0
    let duplicatesRemoved = 0
    const duplicateReport = []

    // Check for duplicates and remove them
    for (const [phone, userGroup] of Object.entries(phoneGroups)) {
      if (userGroup.length > 1) {
        duplicatesFound += userGroup.length - 1
        
        // Keep the first user, remove the rest
        const keepUser = userGroup[0]
        const removeUsers = userGroup.slice(1)
        
        duplicateReport.push({
          phone: phone,
          kept: `${keepUser.name} (${keepUser.role})`,
          removed: removeUsers.map(u => `${u.name} (${u.role})`).join(', ')
        })

        // Delete duplicate users
        for (const user of removeUsers) {
          await deleteDoc(doc(db, 'users', user.id))
          duplicatesRemoved++
        }
      }
    }

    const report = duplicateReport.length > 0 
      ? `\n\nDuplicate Report:\n${duplicateReport.map(d => 
          `Phone: ${d.phone}\n  Kept: ${d.kept}\n  Removed: ${d.removed}`
        ).join('\n\n')}`
      : ''

    return {
      success: true,
      message: `Cleanup completed!\nTotal users: ${users.length}\nDuplicates found: ${duplicatesFound}\nDuplicates removed: ${duplicatesRemoved}${report}`
    }
    
  } catch (error) {
    console.error('Error cleaning up users:', error)
    return { success: false, message: 'Error: ' + error.message }
  }
}

export async function listAllUsers() {
  try {
    const usersSnap = await getDocs(collection(db, 'users'))
    const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    const userList = users.map(user => 
      `${user.name || 'No Name'} | ${user.phone || 'No Phone'} | ${user.role || 'No Role'} | ${user.email || 'No Email'}`
    ).join('\n')

    return {
      success: true,
      message: `Total Users: ${users.length}\n\n${userList}`,
      users: users
    }
    
  } catch (error) {
    console.error('Error listing users:', error)
    return { success: false, message: 'Error: ' + error.message }
  }
}