export class BLENotificationBatchEnabler {
    constructor({characteristics = [], batchSize = 2, delay = 500}) {
        this.characteristics = characteristics;
        this.batchSize = batchSize;
        this.delayBetweenBatches = delay;
        this.batches = [];
        this.currentBatchIndex = 0;
        this.results = [];
    }

    // 开始处理
    start(deviceId, characteristics, serviceId) {
        this.deviceId = deviceId;
        this.serviceId = serviceId;
        this.characteristics = characteristics
        return new Promise((resolve, reject) => {
            this.resolvePromise = resolve;
            this.rejectPromise = reject;

            this.prepareBatches();
            this.processBatch();
        });
    }

    // 准备批次
    prepareBatches() {
        for (let i = 0; i < this.characteristics.length; i += this.batchSize) {
            this.batches.push(this.characteristics.slice(i, i + this.batchSize));
        }
    }

    // 处理批次
    processBatch() {
        if (this.currentBatchIndex >= this.batches.length) {
            this.resolvePromise(this.results);
            return;
        }

        const batch = this.batches[this.currentBatchIndex];
        if (!batch || batch.length === 0) {
            this.currentBatchIndex++;
            this.processBatch();
            return;
        }

        // console.log(`Processing batch ${this.currentBatchIndex} of ${this.batches.length}`);

        this.enableNotificationInBatch(0, batch, () => {
            this.currentBatchIndex++;
            setTimeout(() => {
                this.processBatch();
            }, this.delayBetweenBatches);
        });
    }

    num = 0

    // 处理批次中的每个特征值
    enableNotificationInBatch(index, batch, callback) {
        if (index >= batch.length) {
            callback();
            return;
        }

        const characteristic = batch[index];
        if (!characteristic.properties || !characteristic.properties.notify) {
            this.enableNotificationInBatch(index + 1, batch, callback);
            return;
        }

        uni.notifyBLECharacteristicValueChange({
            state: true,
            deviceId: this.deviceId,
            serviceId: this.serviceId,
            characteristicId: characteristic.uuid,
            success: (res) => {
                // console.log(`成功启用通知：${characteristic.uuid}`);
                this.num = 0
                this.results.push({
                    uuid: characteristic.uuid,
                    status: true
                });
                this.enableNotificationInBatch(index + 1, batch, callback);
            },
            fail: (err) => {
                console.error(`启用通知失败：${characteristic.uuid}`, err);
                this.results.push({
                    uuid: characteristic.uuid,
                    status: false,
                    error: err
                });

                if ([10004, 10005].includes(err.code)) {
                    if (this.num > 10) {

                    } else {
                        // 如果失败，仍然可以选择调用下一个，或者根据需求进行处理
                        setTimeout(() => {
                            this.enableNotificationInBatch(index, batch, callback); //

                        }, this.delayBetweenBatches);
                    }
                    this.num++

                }
                // this.enableNotificationInBatch(index + 1, batch, callback); // 失败跳过
            }
        });
    }
}
