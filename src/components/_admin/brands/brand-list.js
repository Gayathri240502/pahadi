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
import Brand from 'src/components/table/rows/brand';

const TABLE_HEAD = [
  { id: 'name', label: 'Brands' },
  { id: 'description', label: 'Description' },
  { id: 'status', label: 'Status' },
  { id: 'createdAt', label: 'Date' },
  { id: '', label: 'Actions' }
];

export default function BrandList() {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const searchParam = searchParams.get('search');
  const statusParam = searchParams.get('status'); // ✅ read status filter

  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);

  const { data, isPending: isLoading } = useQuery({
    queryKey: ['brands', apicall, searchParam, pageParam],
    queryFn: () => api.getBrandsByAdmin(+pageParam || 1, searchParam || '')
  });

  // ✅ Normalize data (avoid undefined description)
  const brandList = Array.isArray(data?.data)
    ? data.data.map((b) => ({
        ...b,
        description: b.description || 'Not available'
      }))
    : [];

  // ✅ Apply filter
  const filteredData = statusParam
    ? brandList.filter((item) => item.status?.toLowerCase() === statusParam.toLowerCase())
    : brandList;

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
          endPoint="deleteBrandByAdmin"
          type={'Brand deleted'}
          deleteMessage={
            'This brand is linked to products. Deleting it will also remove all related data. Are you sure you want to continue?'
          }
        />
      </Dialog>

      <Table
        headData={TABLE_HEAD}
        data={{ data: filteredData }} // ✅ same structure for Table
        isLoading={isLoading}
        row={Brand}
        handleClickOpen={handleClickOpen}
        isSearch
        filters={[STATUS_FILTER]} // ✅ include status filter
      />
    </>
  );
}

const STATUS_FILTER = {
  name: 'Status',
  param: 'status',
  data: [
    { name: 'Active', slug: 'active' },
    { name: 'Inactive', slug: 'inactive' }
  ]
};
