export interface MailerOptions {
  subject: string;
  from: string;
  to: string;
  template: string;
  context: { [key: string]: any };
}

export interface MailerInterface {
  send(options: MailerOptions): Promise<void>;
}
