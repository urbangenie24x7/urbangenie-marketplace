import { useState } from 'react'

export default function VendorsAdmin() {
  const [vendors, setVendors] = useState([])
  const [activeTab, setActiveTab] = useState('all')

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">FreshCuts Vendors</h1>
        <button className="bg-green-500 text-white px-4 py-2 rounded">Onboard Vendor</button>
      </div>
      
      <div className="mb-4">
        <nav className="flex space-x-4">
          {['all', 'pending', 'active', 'suspended'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded ${activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Vendor Name</th>
              <th className="px-4 py-2 text-left">Contact</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Products</th>
              <th className="px-4 py-2 text-left">Commission</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(vendor => (
              <tr key={vendor.id} className="border-t">
                <td className="px-4 py-2">{vendor.name}</td>
                <td className="px-4 py-2">{vendor.contact}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    vendor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {vendor.status}
                  </span>
                </td>
                <td className="px-4 py-2">{vendor.productCount}</td>
                <td className="px-4 py-2">{vendor.commission}%</td>
                <td className="px-4 py-2">
                  <button className="text-blue-500 mr-2">View</button>
                  <button className="text-orange-500 mr-2">Edit</button>
                  <button className="text-red-500">Suspend</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}