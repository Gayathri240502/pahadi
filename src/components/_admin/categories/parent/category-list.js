'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
// api
import * as api from 'src/services';
// usequery
import { useQuery } from '@tanstack/react-query';
// mui
import { Dialog } from '@mui/material';
// components
import DeleteDialog from 'src/components/dialog/delete';
import Table from 'src/components/table/table';
import Category from 'src/components/table/rows/category';

const TABLE_HEAD = [
  { id: 'name', label: 'Category' },
  { id: 'description', label: 'Description' },
  { id: 'status', label: 'Status' },
  { id: 'createdAt', label: 'Date' },
  { id: '', label: 'Actions' }
];

export default function CategoryList() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const statusParam = searchParams.get('status'); // ✅ added

  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['categories', apicall, searchParam, pageParam],
    queryFn: () => api.getCategoriesByAdmin(+pageParam || 1, searchParam || '')
  });

  // ✅ Ensure data is always an array
  const categories = Array.isArray(data?.data) ? data.data : [];

  // ✅ Apply status filter if any
  const filteredData =
    statusParam && statusParam.toLowerCase() !== 'none'
      ? categories.filter((item) => item.status?.toLowerCase() === statusParam.toLowerCase())
      : categories;

  const handleClickOpen = (prop) => () => {
    setId(prop);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth={'xs'}>
        <DeleteDialog
          onClose={handleClose}
          id={id}
          apicall={setApicall}
          endPoint="deleteCategoryByAdmin"
          type={'Category deleted'}
          deleteMessage={
            'This category is linked to products, subcategories, and child categories. Deleting it will also remove all related data. Are you sure you want to continue?'
          }
        />
      </Dialog>

      {/* ✅ Updated data to filteredData */}
      <Table
        headData={TABLE_HEAD}
        data={{ data: filteredData }}
        isLoading={isLoading}
        row={Category}
        handleClickOpen={handleClickOpen}
        isSearch
        filters={[STATUS_FILTER]}
      />
    </>
  );
}

const STATUS_FILTER = {
  name: 'Status',
  param: 'status',
  data: [
    // { name: 'None', slug: 'none' }, // ✅ added "None" option
    { name: 'Active', slug: 'active' },
    { name: 'Inactive', slug: 'inactive' }
  ]
};
