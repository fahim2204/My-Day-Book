// ** Custom Components
import Timeline from '@components/timeline'

// ** Reactstrap Imports
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap'

// ** Timeline Data
import { iconsData } from './data'

const IconsTimeline = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle tag='h4'>Activites</CardTitle>
      </CardHeader>
      <CardBody>
        <Timeline data={iconsData} />
      </CardBody>
    </Card>
  )
}

export default IconsTimeline
