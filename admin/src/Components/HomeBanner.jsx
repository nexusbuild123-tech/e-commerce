import { useState, useEffect } from 'react';
import { broadcastRefresh } from '../utils/broadcast';

const apiUrl = import.meta.env.VITE_API_URL;

const HomeBanner = () => {
  const [banners, setBanners] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileData, setFileData] = useState({ name: '', data: '' });
  const [isUploading, setIsUploading] = useState(false);

  const fetchBanners = async () => {
    try {
      const response = await fetch(`${apiUrl}/banners?t=${Date.now()}`, { cache: 'no-store' });
      const data = await response.json();
      if (data.status === 'success') setBanners(data.banners);
    } catch (error) {
      console.error('Banner fetch failed', error);
    }
  };

  useEffect(() => {
    // ✅ Data fetching – suppress ESLint warning
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBanners();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFileData({ name: file.name, data: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadBanner = async () => {
    if (!fileData.data) return alert('Please select an image first!');
    setIsUploading(true);
    try {
      const response = await fetch(`${apiUrl}/admin/upload-banner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': 'nexusBuild@123+!' },
        body: JSON.stringify({ filename: fileData.name, image_data: fileData.data }),
      });
      if (response.ok) {
        alert('Banner Uploaded!');
        setPreviewImage(null);
        setFileData({ name: '', data: '' });
        const input = document.getElementById('bannerUploadInput');
        if (input) input.value = '';
        fetchBanners();
        broadcastRefresh();
      }
    } catch (error) {
      alert('Error uploading banner.');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    try {
      const response = await fetch(`${apiUrl}/admin/delete-banner/${id}`, {
        method: 'DELETE',
        headers: { 'x-api-key': 'nexusBuild@123+!' },
      });
      if (response.ok) {
        fetchBanners();
        broadcastRefresh();
      }
    } catch (error) {
      console.error('Error deleting banner', error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
        <h3 className="text-lg font-bold mb-4 border-b pb-2">Upload Banner</h3>
        <input
          id="bannerUploadInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 cursor-pointer"
        />
        {previewImage && (
          <div className="mt-6">
            <p className="text-xs text-gray-500 mb-2">Preview:</p>
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-40 object-cover rounded shadow-sm border"
            />
            <button
              onClick={handleUploadBanner}
              disabled={isUploading}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              {isUploading ? 'Uploading...' : 'Upload Banner'}
            </button>
          </div>
        )}
      </div>
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <h3 className="text-lg font-bold mb-4 border-b pb-2">Active Banners</h3>
        <table className="w-full text-left min-w-[400px]">
          <thead>
            <tr className="text-gray-400 text-sm border-b">
              <th className="pb-3">Image</th>
              <th className="pb-3">Name</th>
              <th className="pb-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id} className="border-b hover:bg-gray-50">
                <td className="py-3">
                  <img src={b.image_data} className="w-20 h-10 object-cover rounded shadow-sm" alt="banner" />
                </td>
                <td className="py-3 text-sm text-gray-700">{b.filename}</td>
                <td className="py-3 text-right">
                  <button onClick={() => handleDeleteBanner(b.id)} className="text-red-500 font-semibold text-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomeBanner;