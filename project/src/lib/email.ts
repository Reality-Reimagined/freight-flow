import { Resend } from 'resend';
import { supabase } from './supabase';
import { PDFDocument } from 'pdf-lib';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

interface EmailTrackingData {
  email_id: string;
  recipient: string;
  load_id: string;
  event_type: 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed';
  metadata?: any;
  created_at?: string;
}

interface CompanyEmailFormat {
  company_name: string;
  subject_line_format: string;
  reference_number_prefix: string;
  required_documents: string[];
  email_instructions: string;
}

interface LoadDocument {
  type: string;
  file: File | Buffer;
  filename: string;
}

// First, create a table in Supabase for email tracking
/*
create table email_tracking (
  id uuid default uuid_generate_v4() primary key,
  email_id text not null,
  recipient text not null,
  load_id uuid references loads(id),
  event_type text not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
*/

export const sendLoadDocuments = async ({
  to,
  loadId,
  companyName,
  documents,
  loadDetails
}: {
  to: string;
  loadId: string;
  companyName: string;
  documents: LoadDocument[];
  loadDetails: any;
}) => {
  try {
    // Fetch company-specific email format
    const { data: emailFormat, error: formatError } = await supabase
      .from('company_email_formats')
      .select('*')
      .eq('company_name', companyName)
      .single();

    if (formatError) throw formatError;

    // Validate required documents
    const missingDocs = emailFormat.required_documents.filter(
      required => !documents.some(doc => doc.type === required)
    );

    if (missingDocs.length > 0) {
      throw new Error(`Missing required documents: ${missingDocs.join(', ')}`);
    }

    // Format subject line
    const subject = formatEmailSubject(emailFormat, loadDetails);

    // Prepare documents according to company preference
    const attachments = await prepareAttachments(documents, emailFormat, loadDetails);

    // Send email with Resend
    const { data, error } = await resend.emails.send({
      from: 'Load Documentation <docs@your-domain.com>',
      to: [to],
      subject: subject,
      react: LoadDocumentationEmail({
        companyFormat: emailFormat,
        loadDetails,
        documents: documents.map(d => d.filename),
      }),
      attachments: attachments,
    });

    if (error) throw error;

    // Track the email
    await trackEmailEvent({
      email_id: data.id,
      recipient: to,
      load_id: loadId,
      event_type: 'sent',
      metadata: {
        company_name: companyName,
        documents: documents.map(d => d.type),
      }
    });

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send load documents:', error);
    return { success: false, error };
  }
};

const formatEmailSubject = (
  format: CompanyEmailFormat, 
  loadDetails: any
): string => {
  return format.subject_line_format
    .replace('{reference_number}', `${format.reference_number_prefix}${loadDetails.reference_number}`)
    .replace('{origin}', loadDetails.origin)
    .replace('{destination}', loadDetails.destination);
};

const prepareAttachments = async (
  documents: LoadDocument[],
  format: CompanyEmailFormat,
  loadDetails: any
): Promise<any[]> => {
  // Some companies require combined PDFs
  if (format.company_name === 'TQL') {
    const combinedPdf = await PDFDocument.create();
    
    for (const doc of documents) {
      const docBytes = doc.file instanceof File 
        ? await doc.file.arrayBuffer()
        : doc.file;
      const pdf = await PDFDocument.load(docBytes);
      const copiedPages = await combinedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => combinedPdf.addPage(page));
    }

    const pdfBytes = await combinedPdf.save();
    return [{
      filename: `TQL_${loadDetails.reference_number}_Documents.pdf`,
      content: pdfBytes,
    }];
  }

  // Others prefer separate attachments
  return documents.map(doc => ({
    filename: `${format.company_name}_${loadDetails.reference_number}_${doc.type}.pdf`,
    content: doc.file,
  }));
};

// Track email events
const trackEmailEvent = async (trackingData: EmailTrackingData) => {
  const { error } = await supabase
    .from('email_tracking')
    .insert([trackingData]);

  if (error) {
    console.error('Failed to track email event:', error);
  }
};

// Analytics functions
export const getEmailAnalytics = async (loadId?: string) => {
  let query = supabase
    .from('email_tracking')
    .select('*');

  if (loadId) {
    query = query.eq('load_id', loadId);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return {
    total: data.length,
    sent: data.filter(d => d.event_type === 'sent').length,
    delivered: data.filter(d => d.event_type === 'delivered').length,
    opened: data.filter(d => d.event_type === 'opened').length,
    clicked: data.filter(d => d.event_type === 'clicked').length,
    failed: data.filter(d => d.event_type === 'failed').length,
    events: data
  };
}; 