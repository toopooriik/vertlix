<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Attribute\Route;
use RuntimeException;

#[Route('/api')]
class ContactController extends AbstractController
{
    private const RECIPIENT_EMAIL = 'is511723@gmail.com';
    private const FROM_EMAIL = self::RECIPIENT_EMAIL;

    #[Route('/contact', name: 'api_contact_send', methods: ['POST'])]
    public function send(Request $request, MailerInterface $mailer): JsonResponse
    {
        $payload = json_decode($request->getContent(), true);

        if (!is_array($payload)) {
            return $this->json([
                'message' => 'Некорректный формат запроса.',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        if (trim((string) ($payload['website'] ?? '')) !== '') {
            return $this->json(['message' => 'Заявка отправлена.']);
        }

        $data = [
            'fullName' => $this->normalizeText($payload['fullName'] ?? ''),
            'email' => $this->normalizeText($payload['email'] ?? ''),
            'comment' => $this->normalizeText($payload['comment'] ?? '', true),
        ];
        $errors = $this->validateContactData($data);

        if ($errors !== []) {
            return $this->json([
                'message' => 'Проверьте поля формы.',
                'errors' => $errors,
            ], JsonResponse::HTTP_UNPROCESSABLE_ENTITY);
        }

        $email = (new Email())
            ->from(sprintf('Veltrix <%s>', self::FROM_EMAIL))
            ->replyTo($data['email'])
            ->to(self::RECIPIENT_EMAIL)
            ->subject('Новая заявка с сайта Veltrix')
            ->text($this->buildTextEmail($data))
            ->html($this->buildHtmlEmail($data));

        try {
            $savedFile = $this->saveRequestToFile($data, $request);
        } catch (RuntimeException) {
            return $this->json([
                'message' => 'Не удалось сохранить заявку. Попробуйте позже.',
            ], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }

        try {
            $mailer->send($email);
        } catch (TransportExceptionInterface) {
            // Local file storage is the source of truth while SMTP is not configured.
        }

        return $this->json([
            'message' => 'Заявка сохранена.',
            'file' => basename($savedFile),
        ]);
    }

    /**
     * @param array{fullName: string, email: string, comment: string} $data
     *
     * @return array<string, string>
     */
    private function validateContactData(array $data): array
    {
        $errors = [];
        $fullNameLength = mb_strlen($data['fullName']);
        $commentLength = mb_strlen($data['comment']);

        if ($data['fullName'] === '') {
            $errors['fullName'] = 'Укажите ФИО.';
        } elseif ($fullNameLength < 2 || $fullNameLength > 120) {
            $errors['fullName'] = 'ФИО должно быть от 2 до 120 символов.';
        } elseif (!preg_match("/^[\\p{L}\\s.'-]+$/u", $data['fullName'])) {
            $errors['fullName'] = 'ФИО может содержать только буквы, пробелы, дефис, точку и апостроф.';
        }

        if ($data['email'] === '') {
            $errors['email'] = 'Укажите почту.';
        } elseif (mb_strlen($data['email']) > 180 || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Укажите корректную почту.';
        }

        if ($data['comment'] === '') {
            $errors['comment'] = 'Опишите вопрос.';
        } elseif ($commentLength < 10 || $commentLength > 2000) {
            $errors['comment'] = 'Вопрос должен быть от 10 до 2000 символов.';
        }

        return $errors;
    }

    private function normalizeText(mixed $value, bool $preserveLines = false): string
    {
        if (!is_scalar($value)) {
            return '';
        }

        $text = strip_tags((string) $value);

        if ($preserveLines) {
            $text = preg_replace('/[ \t]+/u', ' ', $text) ?? '';
            $text = preg_replace('/\R{3,}/u', "\n\n", trim($text)) ?? '';

            return $text;
        }

        return preg_replace('/\s+/u', ' ', trim($text)) ?? '';
    }

    /**
     * @param array{fullName: string, email: string, comment: string} $data
     */
    private function buildTextEmail(array $data): string
    {
        return sprintf(
            "Новая заявка с сайта Veltrix\n\nФИО: %s\nПочта: %s\n\nВопрос:\n%s\n",
            $data['fullName'],
            $data['email'],
            $data['comment']
        );
    }

    /**
     * @param array{fullName: string, email: string, comment: string} $data
     */
    private function saveRequestToFile(array $data, Request $request): string
    {
        $mailDir = (string) $this->getParameter('kernel.project_dir') . '/mail';

        if (!is_dir($mailDir) && !mkdir($mailDir, 0775, true) && !is_dir($mailDir)) {
            throw new RuntimeException('Unable to create mail directory.');
        }

        $createdAt = new \DateTimeImmutable();
        $filePath = sprintf(
            '%s/%s-%s.txt',
            $mailDir,
            $createdAt->format('Ymd-His'),
            bin2hex(random_bytes(4))
        );
        $content = sprintf(
            "Новая заявка с сайта Veltrix\n\nДата: %s\nКому: %s\nФИО: %s\nПочта: %s\nIP: %s\nUser-Agent: %s\n\nВопрос:\n%s\n",
            $createdAt->format('Y-m-d H:i:s P'),
            self::RECIPIENT_EMAIL,
            $data['fullName'],
            $data['email'],
            $request->getClientIp() ?? 'unknown',
            mb_substr((string) $request->headers->get('User-Agent', ''), 0, 500),
            $data['comment']
        );

        if (file_put_contents($filePath, $content, LOCK_EX) === false) {
            throw new RuntimeException('Unable to write mail file.');
        }

        return $filePath;
    }

    /**
     * @param array{fullName: string, email: string, comment: string} $data
     */
    private function buildHtmlEmail(array $data): string
    {
        return sprintf(
            '<h2>Новая заявка с сайта Veltrix</h2><p><b>ФИО:</b> %s</p><p><b>Почта:</b> %s</p><p><b>Вопрос:</b><br>%s</p>',
            $this->escape($data['fullName']),
            $this->escape($data['email']),
            nl2br($this->escape($data['comment']))
        );
    }

    private function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
}
