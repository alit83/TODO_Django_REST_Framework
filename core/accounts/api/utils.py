from threading import Thread


class VerificationThread(Thread):
    def __init__(self, message):
        Thread.__init__(self)
        self.message = message

    def run(self):
        self.message.send()
