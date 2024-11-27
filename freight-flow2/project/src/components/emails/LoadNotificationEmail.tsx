import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Preview,
} from '@react-email/components';

interface EmailTemplateProps {
  type: 'booked' | 'updated' | 'cancelled' | 'created';
  loadDetails: {
    origin: string;
    destination: string;
    pickupDate: string;
    deliveryDate: string;
    rate: number;
  };
}

export const EmailTemplate = ({
  type,
  loadDetails,
}: EmailTemplateProps) => {
  const getSubject = () => {
    switch (type) {
      case 'booked':
        return 'Your load has been booked';
      case 'updated':
        return 'Load details have been updated';
      case 'cancelled':
        return 'Load has been cancelled';
      case 'created':
        return 'New load posted';
      default:
        return 'Load notification';
    }
  };

  return (
    <Html>
      <Head />
      <Preview>{getSubject()}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>{getSubject()}</Text>
          
          <Text style={paragraph}>
            Load Details:
          </Text>
          
          <div style={detailsContainer}>
            <Text style={detail}>
              Origin: {loadDetails.origin}
            </Text>
            <Text style={detail}>
              Destination: {loadDetails.destination}
            </Text>
            <Text style={detail}>
              Pickup: {new Date(loadDetails.pickupDate).toLocaleDateString()}
            </Text>
            <Text style={detail}>
              Delivery: {new Date(loadDetails.deliveryDate).toLocaleDateString()}
            </Text>
            <Text style={detail}>
              Rate: ${loadDetails.rate.toLocaleString()}
            </Text>
          </div>

          <Link
            href={`https://your-domain.com/loads/${loadDetails.id}`}
            style={button}
          >
            View Load Details
          </Link>
        </Container>
      </Body>
    </Html>
  );
};

// Email styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

// ... more styles ...

export default EmailTemplate; 