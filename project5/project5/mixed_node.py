import sys, random
from locust import HttpLocust, TaskSet

def readNode(locust):
    """ define a function in python whose name is previewPage and the argument is locust """
    postid = random.randint(1, 500) # generate a random number from 1 to 100 (include 1 and 100)
    url_prefix = '/blog/cs144';
    locust.client.get(url_prefix+'/'+str(postid),name=url_prefix)

def writeNode(locust):
    """ define a function in python whose name is previewPage and the argument is locust """
    postid = random.randint(1, 500) # generate a random number from 1 to 100 (include 1 and 100)
    url_prefix = '/api/cs144/'+str(postid);
    post={'title':"Loading Test",'body':'***Hello World!***'}
    locust.client.put(url_prefix,post,name='/api/locust (update)')

class MyTaskSet(TaskSet):
    """ the class MyTaskSet inherits from the class TaskSet, defining the behavior of the user """
    tasks = {readNode: 9, writeNode: 1}
    def on_start(locust):
        """ on_start is called when a Locust start before any task is scheduled """
        response = locust.client.get("/login?username=cs144&password=password")
        if response.status_code != 200:
            print("FAIL to start with posting data to server. Make sure that your server is running.")
            sys.exit();

class MyLocust(HttpLocust):
    """ the class MyLocust inherits from the class HttpLocust, representing an HTTP user """
    task_set = MyTaskSet
    min_wait = 1000
    max_wait = 2000
