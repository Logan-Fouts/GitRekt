"use client"
import React from 'react';

const ListItem = (props) => {
  return (
    <li>{props.name}</li>
  );
}

export default function SideBar () {
  return (
    <div className='bg-slate-700 w-2/12'>
      <a className='text-2xl'>Repo</a>
      <ul className='flex flex-col bg-red-500 w-2/3'>
        <ListItem name='Local' />
        <ListItem name='Remote' />
      </ul>
    </div>
  ); 
};