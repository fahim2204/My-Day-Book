import { Fragment } from 'react'

import pdf from '@src/assets/images/icons/file-icons/pdf.png'

import { Button, UncontrolledCollapse, ListGroup, ListGroupItem, Badge } from 'reactstrap'

import { Share2, MessageSquare, PhoneCall, PenTool, User, FileText, MapPin, ShoppingBag, Server } from 'react-feather'

export const iconsData = [
  {
    title: '12 Invoices have been paid',
    content: 'Invoices have been paid to the company.',
    icon: <PenTool size={14} />,
    meta: '12 min ago',
    customContent: (
      <div className='d-flex align-items-center'>
        <img className='me-1' src={pdf} alt='pdf' height='23' />
        <span>invoice.pdf</span>
      </div>
    )
  }
]
