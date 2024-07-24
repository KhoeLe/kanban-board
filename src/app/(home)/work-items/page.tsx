import WorkItemsBoard from '@/components/work-items/work-item-board'
import React from 'react'
import { getRequests, getWorkItems } from '../../../../data/work-item'

async function WorkItemPage() {

  const workItemData =  await getWorkItems()
  const requests = await getRequests()

  return (
    <div className='flex flex-row '>
      <div className=' h-dvh p-6'>
        Side bar
      </div>
      <WorkItemsBoard requestData={requests} workItemData={workItemData} />
    </div>
  )
}

export default WorkItemPage
