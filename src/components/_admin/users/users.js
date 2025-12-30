'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

// api
import * as api from 'src/services';
import { useQuery, useMutation } from '@tanstack/react-query';

// components
import Table from 'src/components/table/table';
import UserList from '@/components/table/rows/user';
import RoleDialog from 'src/components/dialog/role';

const TABLE_HEAD = [
  { id: 'name', label: 'User' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'orders', label: 'Orders' },
  { id: 'role', label: 'Role' },
  { id: 'joined', label: 'Joined' },
  { id: '', label: 'Actions' }
];

export default function AdminUsers() {
  const searchParams = useSearchParams();

  // ✅ Read URL params
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const roleParam = searchParams.get('role'); // 👈 added for filtering by role

  const [count, setCount] = useState(0);
  const [id, setId] = useState(null);

  // ✅ Fetch user list
  const { data, isPending: isLoading } = useQuery({
    queryKey: ['user', pageParam, searchParam, count, roleParam],
    queryFn: () => api.getUserByAdminsByAdmin(+pageParam || 1, searchParam || '')
  });

  // ✅ Handle Role Update Mutation
  const { mutate, isPending: roleLoading } = useMutation({
    mutationFn: api.updateUserRoleByAdmin,
    onSuccess: (data) => {
      toast.success(data?.message || 'Role updated successfully');
      setCount((prev) => prev + 1);
      setId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update role');
      setId(null);
    }
  });

  // ✅ Client-side filtering by role
  const filteredData = roleParam
    ? {
        ...data,
        data: data?.data?.filter((user) => user.role?.toLowerCase() === roleParam.toLowerCase())
      }
    : data;

  return (
    <div>
      {/* ✅ Role update dialog */}
      <RoleDialog open={Boolean(id)} onClose={() => setId(null)} onClick={() => mutate(id)} loading={roleLoading} />

      {/* ✅ Table with filters */}
      <Table
        headData={TABLE_HEAD}
        data={filteredData}
        isLoading={isLoading}
        row={UserList}
        setId={setId}
        isSearch
        filters={[{ ...USER_ROLE_FILTERS }]}
      />
    </div>
  );
}

const USER_ROLE_FILTERS = {
  name: 'Role',
  param: 'role',
  data: [
    // { name: 'None', slug: '' }, // 👈 Show all users
    { name: 'Users', slug: 'user' },
    { name: 'Vendors', slug: 'vendor' },
    { name: 'Admins', slug: 'admin' }
  ]
};
