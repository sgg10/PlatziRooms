<template>
    <div>
        <page-layout>
            <section class="py-4 bg-teal-dark">
                <div class="container">
                    <form class="form">
                    <div class="form__field relative">
                        <i class="input-icon material-icons absolute text-grey-darker">search</i>
                        <input
                        class="input__search"
                        id="where"
                        type="text"
                        placeholder="Mexico City, Mexico">
                    </div>
                    </form>
                </div>
            </section>
            <section class="section__create py-6">
                <div class="container">
                    <h1 class="text-3xl">Publish a new room</h1>
                    <form >
                        <div class="mb-4">
                            <label for="" class="input__label">Title</label>
                            <input v-model="publication.title" type="text"
                            class="input__field" placeholder="Title">
                        </div>
                        <div class="mb-4">
                            <label for="" class="input__label">Description</label>
                            <textarea v-model="publication.description" rows="10"
                            class="input__field" placeholder="Description"></textarea>
                        </div>
                        <div class="mb-4">
                            <label for="" class="input__label">Featured Image</label>
                            <input v-model="publication.featured_image" type="text"
                            class="input__field" placeholder="Title">
                        </div>
                        <div class="mb-4">
                            <label for="" class="input__label">Servicios</label>
                            <button v-for="(item, index) in services"
                            :key="index" @click.prevent="setService(item)"
                            class="my-1 py-3 px-6 mr-4 rounded"
                            :class="isActive(item) ? 'bg-green' : 'bg-grey-light'">
                              {{item.name}}
                            </button>
                        </div>
                        <div class="mb-4 text-right">
                            <button class="w-full bg-yellow-dark text-yellow-darked
                            font-semibold py-3 px-6 rounded" @click.prevent="save">
                                Publish
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </page-layout>
    </div>
</template>

<script>
import PageLayout from '@/layouts/PageLayout.vue';
import { mapGetters } from 'vuex';

export default {
  components: { PageLayout },
  data() {
    return {
      publication: {
        title: '',
        description: '',
        featured_image: '',
        services: { }
      },
    };
  },
  methods: {
    save() {
      const { title, description, featured_image, services } = this.publication;
      const room = {
        title,
        description,
        featured_image: featured_image,
        publishedAt: Date.now(),
        services
      };

      this.$store.dispatch('CREATE_ROOM', room);
      this.$router.push({name: 'SearchPage'})
    },
    setService(item){
      if(this.publication.services[item['.key']]){
        this.$delete(this.publication.services, item['.key'])
      } else{
        this.$set(this.publication.services, item['.key'], item['.key'])
      }
    },
    isActive(item){
      return this.publication.services[item['.key']] ? true : false
    }
  },
  computed:{
    ...mapGetters(['services'])
  },
  created(){
    this.$store.dispatch('FETCH_SERVICES')
  }
};
</script>
