import AdminLayoutClient from './AdminLayoutClient';

export const metadata = {
  title: 'Admin Dashboard | The Torcia School',
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
