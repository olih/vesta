const createPlainHeader = (text: string) => ({
  type: 'header',
  text: {
    type: 'plain_text',
    text,
    emoji: false,
  },
});

const createMarkdownSection = (text: string) => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text,
  },
});

interface SlackOption {
  readonly title: string;
  readonly value: string;
}

const createOption = (option: SlackOption) => ({
  text: {
    type: 'mrkdwn',
    text: option.title,
  },
  value: option.value,
});
const createCheckboxes = (title: string, options: SlackOption[]) => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: title,
  },
  accessory: {
    type: 'checkboxes',
    options: options.map(createOption),
    action_id: 'checkboxes-action',
  },
});

export {
  SlackOption,
  createPlainHeader,
  createMarkdownSection,
  createCheckboxes,
};
