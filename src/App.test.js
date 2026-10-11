import { render, screen, act, fireEvent } from '@testing-library/react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from '../public/locales/de/translation.json';
import en from '../public/locales/en/translation.json';
import App from './App';

// react-markdown is ESM-only and cannot be loaded by CRA's Jest setup.
jest.mock('react-markdown', () => (props) => props.children);

beforeAll(() =>
  i18n.use(initReactI18next).init({
    lng: 'de',
    fallbackLng: 'de',
    resources: { de: { translation: de }, en: { translation: en } },
    interpolation: { escapeValue: false },
  })
);

beforeEach(async () => {
  jest.useFakeTimers();
  await i18n.changeLanguage('de');
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

test('renders the German page', () => {
  render(<App />);

  expect(screen.getAllByText('Carl Gadde').length).toBeGreaterThan(0);
  expect(screen.getByRole('heading', { name: 'Forschung & Publikationen' })).toBeInTheDocument();
  expect(screen.getByText('Sprachkenntnisse')).toBeInTheDocument();
});

test('lists research items with DOI links, publication first', () => {
  render(<App />);

  const titles = Array.from(document.querySelectorAll('.research-title')).map((el) => el.textContent);
  expect(titles).toEqual([
    'Forensic Analysis of Encrypted SMB Traffic',
    'Forensic Analysis of Encrypted NFS Traffic',
    'Advancing Event Reconstruction in Network Forensics',
    "Backstabber's Knife Collection",
  ]);
  expect(screen.getByRole('link', { name: 'Forensic Analysis of Encrypted SMB Traffic' }))
    .toHaveAttribute('href', 'https://doi.org/10.1145/3848131');
  expect(screen.queryByRole('link', { name: 'Forensic Analysis of Encrypted NFS Traffic' })).not.toBeInTheDocument();
});

test('lists all timeline entries, newest first', () => {
  render(<App />);

  const tabTitles = Array.from(document.querySelectorAll('.tab-title')).map((el) => el.textContent);
  expect(tabTitles).toEqual(['Master', 'Bachelor', 'Arbeit', 'Praktikum', 'Schule']);
  expect(screen.getByRole('heading', { name: 'Informatik (M.Sc.)' })).toBeInTheDocument();
});

test('switches to English via the flag button after the intro', async () => {
  render(<App />);

  act(() => {
    jest.advanceTimersByTime(10000);
  });
  fireEvent.click(screen.getByRole('button', { name: 'Switch to English' }));

  expect(await screen.findByRole('heading', { name: 'Research & Publications' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Auf Deutsch umstellen' })).toBeInTheDocument();
  expect(document.title).toBe('Carl Gadde - CV');
  expect(document.documentElement.lang).toBe('en');
});
