// Run this in browser console to simulate customer login
const testCustomer = {
  id: "test-customer-1",
  phone: "+919876543210",
  name: "Rajesh Kumar",
  email: "rajesh@freshcuts.com",
  role: "customer"
};

localStorage.setItem('currentUser', JSON.stringify(testCustomer));
console.log('Test customer logged in. Refresh the page to see profile.');