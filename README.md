# demo-multiple-entrypoint-backend

Demo multiple entrypoint backend

## Config

Chứa config về environment, job name, kafka topic, error,...

## Common

Chứa logic business dùng chung cho nhiều endtrypoint như model, service, adapter,... Controller của api, job của worker, handler của consumer sẽ gọi chung tới các service trong common.

## Worker

Chứa entrypoint worker và code các job. Để thêm job mới chỉ cần clone job cũ ra, sửa lại queue name, jobname rồi đăng ký tên job trong `worker/router.ts` là được.

## API

Chứa entrypoint api và code api như controller, middleware, router, validator,...

## Consumer

Chứa entrypoint consumer để nhận message từ kafka. Để thêm 1 handler mới cần clone handler cũ, đổi tên, đổi topic nó lắng nghe (có thể nhiều handler cùng lắng nghe 1 topic) rồi thêm handler name vào `consumer/router.ts`. Ngoài ra 1 handler có thể chỉ lắng nghe 1 event nào đó (xác định qua header) trong topic. Ví dụ topic `sample` có 10 event: `created`, `updated`,... thì 1 handler có thể chỉ lắng nghe event `created` trong topic `sample` dựa vào việc implement hàm match để xác định xem có xử lý message đó hay không.